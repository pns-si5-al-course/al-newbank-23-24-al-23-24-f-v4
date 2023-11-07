from datetime import datetime
import aiohttp
import asyncio
from config import FIXER_API_KEY
from schemas import Transaction, TransactionRequest
from services.rates import get_rates


#MOCK
def get_account(account_id: str):
    return {
        "id": "1",
        "currency": "USD",
        "balance": 1000
    }

async def record_transaction(transaction: Transaction):
    url = "http://localhost:3000/transactions"
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=transaction) as response:
            if response.status != 201 and response.status != 200:
                response_text = await response.text()
                raise Exception(f"Failed to record transaction. Status : {response.status}, response : {response_text}")
            
            #print(await response.text())
            return await response.json()

#MOCK
def get_bank_account(currency: str):
    return {
        "id": "1",
        "currency": currency,
        "balance": 1000
    }

def stock_exchange_open():
    #if we are between 6am and 9pm return true
    if datetime.now().hour > 6 and datetime.now().hour < 21:
        return True
    else:
        return False

#MOCK
async def get_rate(sell_currency: str, buy_currency: str):
    """
    Retrieve the exchange rate from sell_currency to buy_currency.
    The rates are calculated with EUR as the base currency.
    """
    try:
        # If the sell currency is EUR, we can directly get the rate
        if sell_currency == "EUR":
            rate = await get_rates("EUR", buy_currency)
            return rate["rates"][buy_currency]
        
        # For other sell currencies, convert to EUR first then to the target currency
        sell_rate = await get_rates("EUR", sell_currency)
        buy_rate = await get_rates("EUR", buy_currency)
        
        # Convert 1 unit of sell currency to EUR
        one_unit_in_eur = 1 / sell_rate['rates'][sell_currency]
        
        # Convert this EUR unit to buy currency
        exchange_rate = one_unit_in_eur * buy_rate['rates'][buy_currency]
        return exchange_rate
        
    except ZeroDivisionError:
        return "Error: Division by zero"

#MOCK
async def simulate_bourse_transaction(bank_account_sell_currency, bank_account_buy_currency, amount: float, sell_currency: str, buy_currency: str):
    """
    Simulates a transaction between the bank and the bourse.
    
    Parameters:
    - bank_account_sell_currency: account from which the amount will be debited
    - bank_account_buy_currency: account to which the amount will be credited
    - amount: the amount to be exchanged
    - sell_currency: the currency to be sold
    - buy_currency: the currency to be bought
    """

    exchange_rate = await get_rate(sell_currency, buy_currency)
    
    # Calculating the received amount after applying the exchange rate
    received_amount = amount * exchange_rate
    
    # Calculating the total cost including the transaction fee
    
    # Simulate a success or failure of the transaction with the bourse
    #transaction_success = random.choice([True, False])
    transaction_success = True
    
    if transaction_success:
        # If the transaction is successful, execute the transfer between the bank accounts
        bank_account_sell_currency["balance"] -= amount
        bank_account_buy_currency["balance"] += received_amount

        # Record the 2 transaction
        asyncio.create_task(record_transaction({
            "type": "bank_to_stock_exchange",
            "idDebited": bank_account_sell_currency['id'],
            "idCredited": "stock_exchange_account",
            "amount": amount,
            "currency": bank_account_sell_currency['currency'],
            "date": datetime.now().isoformat()
        }))

        asyncio.create_task(record_transaction({
            "type": "stock_exchange_to_bank",
            "idDebited": "stock_exchange_account",
            "idCredited": bank_account_buy_currency['id'],
            "amount": received_amount,
            "currency": bank_account_buy_currency['currency'],
            "date": datetime.now().isoformat()
        }))

        return {
            "status": "success",
            "message": "Transaction succeeded.",
            "debited_amount": amount,
            "received_amount": received_amount
        }
    else:
        # If the transaction fails, return a failure message
        return {
            "status": "failure",
            "message": "Transaction failed: Unable to complete the transaction with the bourse."
        }
    
    

async def execute_transaction(transaction_request: TransactionRequest):
    return await execute_client_to_bank_transaction(transaction_request)

async def execute_client_to_bank_transaction(transaction_request: TransactionRequest):
    try:
        # Get the accounts
        client_account = get_account(transaction_request.idDebited)
        bank_account_sell_currency = get_bank_account(transaction_request.source_currency)
        bank_account_buy_currency = get_bank_account(transaction_request.target_currency)
        
        # Check if the client's account has enough funds
        if client_account['balance'] < transaction_request.amount:
            raise Exception("Insufficient funds in the client's account.")
        
        # Transfer funds from client to bank (selling currency)
        client_account['balance']  -= transaction_request.amount
        bank_account_sell_currency['balance']  += transaction_request.amount
        
        # Record the client to bank transaction
        asyncio.create_task(record_transaction({
            "type": "client_to_bank",
            "idDebited": transaction_request.idDebited,
            "idCredited": bank_account_sell_currency['id'],
            "amount": transaction_request.amount,
            "currency": transaction_request.source_currency,
            "date": datetime.now().isoformat()
        }))
        
        #If the bourse is open, execute the transaction with the bourse
        # Simulate the bank executing the transaction with the bourse and receiving funds
        if stock_exchange_open():
            response = await simulate_bourse_transaction(bank_account_sell_currency, bank_account_buy_currency, transaction_request.amount, transaction_request.source_currency, transaction_request.target_currency)
        else:
            exchange_rate = await get_rate(transaction_request.source_currency, transaction_request.target_currency)
            fees = 0.01
            #TODO: check if bank_account_buy_currency has enough funds
            response = {
                "status": "success",    
                "message": "Bourse is closed. Transaction with stock exchange will be executed when it opens.",
                "debited_amount": transaction_request.amount,
                "received_amount": transaction_request.amount * exchange_rate * (1 - fees)
            }
            # Record the pending transaction
            asyncio.create_task(record_transaction({
                "type": "pending_bourse_open_bank_to_stock_exchange",
                "idDebited": bank_account_sell_currency['id'],
                "idCredited": "stock_exchange_account",
                "amount": transaction_request.amount,
                "currency": transaction_request.source_currency,
                "date": datetime.now().isoformat()
            }))

            asyncio.create_task(record_transaction({
                "type": "pending_bourse_open_stock_exchange_to_bank",
                "idDebited": "stock_exchange_account",
                "idCredited": bank_account_buy_currency['id'],
                "amount": transaction_request.amount * exchange_rate,
                "currency": transaction_request.target_currency,
                "date": datetime.now().isoformat()
            }))

            

        #check if the transaction was successful
        if response['status'] == "failure":
            raise Exception(response['message'])
        
        # Transfer funds from bank to client (buying currency)
        bank_account_buy_currency['balance']  -= response['received_amount']
        client_account['balance']  += response['received_amount']
        
        # Record the bank to client transaction
        asyncio.create_task(
            record_transaction({
            "type": "bank_to_client",
            "idDebited": bank_account_buy_currency['id'],
            "idCredited": transaction_request.idDebited,
            "amount": response['received_amount'],
            "currency": transaction_request.target_currency,
            "date": datetime.now().isoformat()
        }))
        
        return {
            "status": "success",
            "message": "Exchange process completed successfully",
            "debited_amount": transaction_request.amount,
            "received_amount": response['received_amount']
        }
    except Exception as e:
        return {
            "status": "failure",
            "message": f"An unexpected error occurred: {str(e)}"
        }