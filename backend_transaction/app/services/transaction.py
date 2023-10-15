import datetime
import random
from schemas import Transaction, TransactionRequest

#MOCK
def get_account(account_id: str):
    return {
        "id": "1",
        "currency": "USD",
        "balance": 1000
    }

#MOCK
def record_transaction(transaction: Transaction):
    pass

#MOCK
def get_bank_account(currency: str):
    return {
        "id": "1",
        "currency": currency,
        "balance": 1000
    }

def bourse_is_open():
    #if we are between 6am and 9pm return true
    if datetime.now().hour > 6 and datetime.now().hour < 21:
        return True
    else:
        return False

import random

async def simulate_pre_transaction_with_bourse(amount: float, sell_currency: str, buy_currency: str):
    # Mocking the exchange rate and transaction fee
    exchange_rate = random.uniform(0.5, 1.5)  # Random exchange rate between 0.5 and 1.5
    transaction_fee_percentage = 0.01  # 1% transaction fee
    
    # Calculating the received amount after applying the exchange rate
    received_amount = amount * exchange_rate
    
    # Calculating the transaction fee
    transaction_fee = received_amount * transaction_fee_percentage
    
    # Calculating the total cost including the transaction fee
    total_cost = amount + transaction_fee
    
    return total_cost, received_amount - transaction_fee

async def simulate_bourse_transaction(bank_account_sell_currency, bank_account_buy_currency, total_cost, received_amount):
    """
    Simulates a transaction between the bank and the bourse.
    
    Parameters:
    - bank_account_sell_currency: account from which the amount will be debited
    - bank_account_buy_currency: account to which the amount will be credited
    - total_cost: the total cost that will be debited from the selling account
    - received_amount: the amount that will be credited to the buying account
    """
    
    # Simulate a success or failure of the transaction with the bourse
    #transaction_success = random.choice([True, False])
    transaction_success = True
    
    if transaction_success:
        # If the transaction is successful, execute the transfer between the bank accounts
        bank_account_sell_currency.balance -= total_cost
        bank_account_buy_currency.balance += received_amount
        return {
            "status": "success",
            "message": f"Transaction successful: {total_cost} debited from {bank_account_sell_currency.currency} account and {received_amount} credited to {bank_account_buy_currency.currency} account."
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
    # Get the accounts
    client_account = get_account(transaction_request.idDebited)
    bank_account_sell_currency = get_bank_account(transaction_request.source_currency)
    bank_account_buy_currency = get_bank_account(transaction_request.target_currency)
    
    # Simulate a transaction with the bourse to get the total cost
    total_cost, received_amount = await simulate_bourse_transaction(transaction_request.amount, transaction_request.source_currency, transaction_request.target_currency)
    
    # Check if the client's account has enough funds
    if client_account.balance < total_cost:
        raise Exception("Insufficient funds in the client's account.")
    
    # Transfer funds from client to bank (selling currency)
    client_account.balance -= total_cost
    bank_account_sell_currency.balance += total_cost
    
    # Record the client to bank transaction
    record_transaction({
        "type": "client_to_bank",
        "idDebited": transaction_request.idDebited,
        "idCredited": bank_account_sell_currency.id,
        "amount": total_cost,
        "currency": transaction_request.source_currency,
        "date": datetime.now().isoformat()
    })
    
    # Simulate the bank executing the transaction with the bourse and receiving funds
    bank_account_sell_currency.balance -= total_cost
    bank_account_buy_currency.balance += received_amount
    
    # Transfer funds from bank to client (buying currency)
    bank_account_buy_currency.balance -= received_amount
    client_account.balance += received_amount
    
    # Record the bank to client transaction
    record_transaction({
        "type": "bank_to_client",
        "idDebited": bank_account_buy_currency.id,
        "idCredited": transaction_request.idDebited,
        "amount": received_amount,
        "currency": transaction_request.currency.split("_to_")[1],
        "date": datetime.now().isoformat()
    })
    
    return {
        "message": "Exchange process completed successfully",
        "total_cost": total_cost,
        "received_amount": received_amount
    }
