from datetime import datetime
import aiohttp
import asyncio
import config
import time
from schemas import Transaction, TransactionRequest
from services.rates import get_rates


async def http_get(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                response_text = await response.text()
                raise Exception(
                    f"Failed to retrieve data from {url}. Status : {response.status}, response : {response_text}"
                )

            return await response.json()


async def http_post(url: str, data: dict):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            if response.status != 201 and response.status != 200:
                response_text = await response.text()
                raise Exception(
                    f"Failed to retrieve data from {url}. Status : {response.status}, response : {response_text}"
                )

            return await response.json()


async def transfer_funds(id_account: str, amount: float):
    url = config.NEO_BANK_URL + "/accounts/executeTransaction"

    body = {"id": id_account, "amount": amount}
    print(f"Initiating transfer: {id_account}, Amount: {amount}",flush=True)
    time.sleep(0.5)
    try:
        await http_post(url, body)
        print("Transfer successful",flush=True)
        time.sleep(0.5)
    except Exception as e:
        print(f"Error occurred during transfer: {e}",flush=True)
        raise Exception(f"Failed to transfer funds: {str(e)}")


async def record_transaction(transaction: Transaction):
    url = config.NEO_BANK_URL + "/transactions"

    try:
        await http_post(url, transaction)
        time.sleep(0.5)
    except Exception as e:
        print(f"Failed to record transaction: {str(e)}",flush=True)


async def get_bank_account(currency: str):
    url = config.NEO_BANK_URL
    print(f"Retrieving bank account for currency: {currency}",flush=True)
    time.sleep(0.5)

    try:
        print("Fetching bank admin details...",flush=True)
        time.sleep(1)
        response = await http_get(url + "/users?name=BankAdmin")
        bank_admin = response[0]
        print("Bank admin details retrieved.",flush=True)
    except Exception as e:
        raise Exception(f"Failed to retrieve bank admin: {str(e)}")

    if currency == "EUR":
        account = bank_admin["mainAccountID"]
    elif currency not in bank_admin["accountList"]:
        raise Exception(f"Bank account not found for currency {currency}")
    else:
        account = bank_admin["accountList"][currency]

    print(f"Fetching bank account details for account ID: {account}",flush=True)
    time.sleep(1)
    try:
        response = await http_get(url + "/accounts?id=" + account)
        bank_account = response
        print(f"Bank account details retrieved for account ID: {account} successfully",flush=True)
        time.sleep(0.5)
    except Exception as e:
        raise Exception(f"Failed to retrieve bank account: {str(e)}")

    return bank_account


async def stock_exchange_open():
    print(f"Checking if the stock exchange is open at hour: {datetime.now().hour}",flush=True)
    time.sleep(1)
    if 6 < datetime.now().hour < 21:
        return False #MOCK
    else:
        return False


# MOCK
async def get_rate(sell_currency: str, buy_currency: str):
    """
    Retrieve the exchange rate from sell_currency to buy_currency.
    The rates are calculated with EUR as the base currency.
    """
    print(f"Fetching exchange rate from {sell_currency} to {buy_currency}",flush=True)
    time.sleep(1)
    try:
        # If the sell currency is EUR, we can directly get the rate
        if sell_currency == "EUR":
            rate = await get_rates("EUR", buy_currency)
            time.sleep(1)
            return rate["rates"][buy_currency]

        # For other sell currencies, convert to EUR first then to the target currency
        sell_rate = await get_rates("EUR", sell_currency)
        buy_rate = await get_rates("EUR", buy_currency)

        # Convert 1 unit of sell currency to EUR
        one_unit_in_eur = 1 / sell_rate["rates"][sell_currency]

        # Convert this EUR unit to buy currency
        exchange_rate = one_unit_in_eur * buy_rate["rates"][buy_currency]
        return exchange_rate

    except ZeroDivisionError:
        return "Error: Division by zero"


# MOCK
async def simulate_bourse_transaction(
    bank_account_sell_account,
    bank_account_buy_account,
    amount: float,
    sell_currency: str,
    buy_currency: str,
):
    """
    Simulates a transaction between the bank and the bourse.

    Parameters:
    - bank_account_sell_account: account from which the amount will be debited
    - bank_account_buy_account: account to which the amount will be credited
    - amount: the amount to be exchanged
    - sell_currency: the currency to be sold
    - buy_currency: the currency to be bought
    """
    print(f"Starting transaction simulation: {amount} {sell_currency} to {buy_currency}",flush=True)
    
    exchange_rate = await get_rate(sell_currency, buy_currency)

    # Calculating the received amount after applying the exchange rate
    received_amount = amount * exchange_rate

    # Calculating the total cost including the transaction fee
    time.sleep(2)
    print(f"Calculated exchange rate, Received amount: {received_amount}",flush=True)

    # Simulate a success or failure of the transaction with the bourse
    # transaction_success = random.choice([True, False])
    transaction_success = True

    if transaction_success:
        # If the transaction is successful, execute the transfer between the bank accounts
        print("Transaction successful, executing transfers",flush=True)

        await transfer_funds(bank_account_sell_account["id"], -amount)
        await transfer_funds(bank_account_buy_account["id"], received_amount)

        # Record the 2 transaction
        asyncio.create_task(
            record_transaction(
                {
                    "type": "bank_to_stock_exchange",
                    "idDebited": bank_account_sell_account["id"],
                    "idCredited": "stock_exchange_account",
                    "amount": amount,
                    "currency": bank_account_sell_account["currency"],
                    "date": datetime.now().isoformat(),
                }
            )
        )

        asyncio.create_task(
            record_transaction(
                {
                    "type": "stock_exchange_to_bank",
                    "idDebited": "stock_exchange_account",
                    "idCredited": bank_account_buy_account["id"],
                    "amount": received_amount,
                    "currency": bank_account_buy_account["currency"],
                    "date": datetime.now().isoformat(),
                }
            )
        )
        time.sleep(1)
        print("Transaction completed and recorded",flush=True)

        return {
            "status": "success",
            "message": "Transaction succeeded.",
            "debited_amount": amount,
            "received_amount": received_amount,
        }
    else:
        # If the transaction fails, return a failure message
        print("Transaction failed: Unable to complete the transaction with the bourse.",flush=True)
        return {
            "status": "failure",
            "message": "Transaction failed: Unable to complete the transaction with the bourse.",
        }


async def exchange_funds_if_needed(user_id: int, source_currency: str, amount: float):

    print(f"Starting fund exchange process for User ID: {user_id}, Source Currency: {source_currency}, Amount: {amount}",flush=True)
    time.sleep(0.5)

    url = config.NEO_BANK_URL
    try:
        print("Retrieving user details...",flush=True)
        time.sleep(0.5)
        response = await http_get(url + "/users?id=" + str(user_id))
        user = response
        time.sleep(1)
        print("user : ",flush=True)
        print(user,flush=True)
    except Exception as e:
        print(f"Failed to retrieve user : {str(e)}",flush=True)
        raise Exception(f"Failed to retrieve user: {str(e)}")

    if source_currency == "EUR":
        account = user["mainAccountID"]
    else:
        account = user["accountList"][source_currency]

    print("account id to debit : ",flush=True)
    print(account,flush=True)
    time.sleep(0.5)

    try:
        print("Retrieving account details for debiting...",flush=True)
        time.sleep(1)
        response = await http_get(url + "/accounts?id=" + account)
        account_to_debit = response
        print("Account Fetched",flush=True)

    except Exception as e:
        print(f"Failed to retrieve account to debit : {str(e)}",flush=True)
        raise Exception(f"Failed to retrieve account to debit: {str(e)}")

    print("account_to_debit : ",flush=True)
    print(account_to_debit,flush=True)
    time.sleep(0.5)

    if account_to_debit["sold"] >= amount:
        return

    if not await stock_exchange_open():
        amount_to_exchange = amount * 1.01 - account_to_debit["sold"]
    else:
        amount_to_exchange = amount - account_to_debit["sold"]

    print("amount_to_exchange : ",flush=True)
    print(amount_to_exchange,flush=True)
    time.sleep(0.5)

    print("Checking if we need to exchange funds",flush=True)
    time.sleep(0.5)

    for key, value in user["accountList"].items():
        if key != source_currency:
            try:
                response = await http_get(url + "/accounts?id=" + value)
                account_exchange = response
            except Exception as e:
                raise Exception(f"Failed to retrieve account to credit: {str(e)}")

            print("Account details for exchange:", account_exchange,flush=True)
            time.sleep(0.5)

            # we need to calculate the amount to exchange with the correct exchange rate, exemple :
            # 1EUR = 1.2USD
            rate = await get_rate(source_currency, key)
            amount_to_exchange_with_rate = (
                amount_to_exchange * rate
            )  # On a besoin de 100EUR, on a 50EUR, on a besoin de 50EUR * 1.2USD = 60USD

            if (
                account_exchange["sold"] >= amount_to_exchange_with_rate
            ):  # Si on a assez de fonds dans le compte
                print(
                    "Executing transfer funds for sufficient balance in exchange account...",flush=True
                )
                time.sleep(0.5)

                await transfer_funds(
                    account_exchange["id"], -amount_to_exchange_with_rate
                )  # On retire les fonds du compte : 60USD
                await transfer_funds(
                    account_to_debit["id"], amount_to_exchange
                )  # On ajoute les fonds au compte : 50EUR
                return
            else:  # Si on a pas assez de fonds dans le compte
                print(
                    "Insufficient funds in exchange account, executing partial transfer...",flush=True
                )
                time.sleep(0.5)
                await transfer_funds(
                    account_exchange["id"], -account_exchange["sold"]
                )  # On retire ce qu'il y a dans le compte : 40USD
                await transfer_funds(
                    account_to_debit["id"], account_exchange["sold"] / rate
                )  # On ajoute les fonds au compte : 40USD / 1.2USD = 33.33EUR

                amount_to_exchange = (
                    amount_to_exchange - account_exchange["sold"] / rate
                )  # On a besoin de 100EUR, on a 50EUR, on a besoin de 50EUR - 33.33EUR = 16.67EUR
    time.sleep(2)
    print("Fund exchange process completed.",flush=True)
    return


async def execute_transaction(transaction_request: TransactionRequest):
    try:
        await exchange_funds_if_needed(
            transaction_request.idUser,
            transaction_request.source_currency,
            transaction_request.amount,
        )
    except Exception as e:
        return {"error": str(e)}

    print("Determining transaction type...",flush=True)
    time.sleep(0.5)
    if transaction_request.source_currency == transaction_request.target_currency:
        print("Executing same currency transaction...",flush=True)
        time.sleep(0.5)

        return await execute_client_to_client_transaction(transaction_request)
    else:
        print("Executing different currency transaction...",flush=True)
        print("Need to exchange funds with the bank...",flush=True)
        time.sleep(0.5)
        return await execute_client_to_bank_transaction(transaction_request)


async def execute_client_to_client_transaction(transaction_request: TransactionRequest):
    try:
        # Transfer funds from client to client
        await transfer_funds(transaction_request.idDebited, -transaction_request.amount)
        await transfer_funds(transaction_request.idCredited, transaction_request.amount)

        # Record the transaction
        print("Recording transaction...",flush=True)
        asyncio.create_task(
            record_transaction(
                {
                    "type": "client_to_client",
                    "idDebited": transaction_request.idDebited,
                    "idCredited": transaction_request.idCredited,
                    "amount": transaction_request.amount,
                    "currency": transaction_request.source_currency,
                    "date": datetime.now().isoformat(),
                }
            )
        )
        time.sleep(1)
        print("Transaction recorded successfully.",flush=True)
        return {
            "status": "success",
            "message": "Exchange process completed successfully",
            "debited_amount": transaction_request.amount,
            "received_amount": transaction_request.amount,
        }
    except Exception as e:
        print(f"Failed to execute client to client transaction: {str(e)}",flush=True)
        return {
            "status": "failure",
            "message": f"An unexpected error occurred: {str(e)}",
        }


async def execute_client_to_bank_transaction(transaction_request: TransactionRequest):
    try:
        print("Retrieving bank accounts for the transaction...",flush=True)
        time.sleep(0.5)
        bank_account_sell_account = await get_bank_account(
            transaction_request.source_currency
        )
        bank_account_buy_account = await get_bank_account(
            transaction_request.target_currency
        )

        asyncio.create_task(
            record_transaction(
                {
                    "type": "client_to_bank",
                    "idDebited": transaction_request.idDebited,
                    "idCredited": bank_account_sell_account["id"],
                    "amount": transaction_request.amount,
                    "currency": transaction_request.source_currency,
                    "date": datetime.now().isoformat(),
                }
            )
        )

        # If the bourse is open, execute the transaction with the bourse
        # Simulate the bank executing the transaction with the bourse and receiving funds
        print("Checking stock exchange status...",flush=True)
        time.sleep(1)
        if await stock_exchange_open():
            print(
                "\033[92mStock exchange is open. Executing transaction with the stock exchange...\033[0m",flush=True
            )
            # Transfer funds from client to bank (selling currency)
            print("Transferring funds from client to bank (selling currency)...",flush=True)
            time.sleep(0.5)

            await transfer_funds(transaction_request.idDebited, -transaction_request.amount)
            await transfer_funds(bank_account_sell_account['id'], transaction_request.amount)
            
            # Record the client to bank transaction
            print("Recording client to bank transaction...",flush=True)
            time.sleep(0.5)

            response = await simulate_bourse_transaction(
                bank_account_sell_account,
                bank_account_buy_account,
                transaction_request.amount,
                transaction_request.source_currency,
                transaction_request.target_currency,
            )
        else:
            print(
                "\033[92mStock exchange is closed. Calculating response with closed stock exchange rates...\033[0m",flush=True
            )
            time.sleep(0.5)

            fees = 0.01
            # Transfer funds from client to bank (selling currency)
            print("Transferring funds from client to bank (selling currency)...",flush=True)
            time.sleep(0.5)
            await transfer_funds(transaction_request.idDebited, -transaction_request.amount * (1 + fees))
            await transfer_funds(bank_account_sell_account['id'], transaction_request.amount * (1 + fees))
            
            # Record the client to bank transaction
            print("Recording client to bank transaction...",flush=True)
            time.sleep(0.5)

            exchange_rate = await get_rate(
                transaction_request.source_currency, transaction_request.target_currency
            )
            
            # TODO: check if bank_account_buy_account has enough funds, for the POC we assume it does.
            response = {
                "status": "success",
                "message": "Bourse is closed. Transaction with stock exchange will be executed when it opens.",
                "debited_amount": transaction_request.amount * (1 + fees),
                "received_amount": transaction_request.amount
                * exchange_rate
            }
            # Record the pending transaction
            print("Recording pending transactions for when the stock exchange opens...",flush=True)
            time.sleep(0.5)

            asyncio.create_task(
                record_transaction(
                    {
                        "type": "pending_bourse_open_bank_to_stock_exchange",
                        "idDebited": bank_account_sell_account["id"],
                        "idCredited": "stock_exchange_account",
                        "amount": transaction_request.amount,
                        "currency": transaction_request.source_currency,
                        "date": datetime.now().isoformat(),
                    }
                )
            )

            asyncio.create_task(
                record_transaction(
                    {
                        "type": "pending_bourse_open_stock_exchange_to_bank",
                        "idDebited": "stock_exchange_account",
                        "idCredited": bank_account_buy_account["id"],
                        "amount": transaction_request.amount * exchange_rate,
                        "currency": transaction_request.target_currency,
                        "date": datetime.now().isoformat(),
                    }
                )
            )

        # check if the transaction was successful
        if response["status"] == "failure":
            print("Transaction failed:", response["message"],flush=True)
            raise Exception(response["message"])

        # Transfer funds from bank to client (buying currency)
        print("Transferring funds from bank to client (buying currency)...",flush=True)
        time.sleep(0.5)

        await transfer_funds(bank_account_buy_account['id'], -response["received_amount"])
        await transfer_funds(
            transaction_request.idCredited, response["received_amount"]
        )
        time.sleep(1)
        print("Funds transferred to the client.",flush=True)
        time.sleep(0.5)

        # Record the bank to client transaction
        asyncio.create_task(
            record_transaction(
                {
                    "type": "bank_to_client",
                    "idDebited": bank_account_buy_account["id"],
                    "idCredited": transaction_request.idDebited,
                    "amount": response["received_amount"],
                    "currency": transaction_request.target_currency,
                    "date": datetime.now().isoformat(),
                }
            )
        )

        print("\033[92mExchange with different currency process completed successfully.\033[0m",flush=True)

        return {
            "status": "success",
            "message": "Exchange process completed successfully",
            "debited_amount": transaction_request.amount,
            "received_amount": response["received_amount"],
        }
    except Exception as e:
        print(f"Failed to execute client to bank transaction: {str(e)}",flush=True)
        return {
            "status": "failure",
            "message": f"An unexpected error occurred: {str(e)}",
        }
