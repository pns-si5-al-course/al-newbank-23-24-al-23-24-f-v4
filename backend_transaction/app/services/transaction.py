from datetime import datetime
import aiohttp
import asyncio
import config
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
    print(f"Initiating transfer: {id_account}, Amount: {amount}")
    try:
        await http_post(url, body)
        print("Transfer successful")

    except Exception as e:
        print(f"Error occurred during transfer: {e}")
        raise Exception(f"Failed to transfer funds: {str(e)}")


async def record_transaction(transaction: Transaction):
    url = config.NEO_BANK_URL + "/transactions"

    try:
        await http_post(url, transaction)
        print("Transfer successful")
    except Exception as e:
        print(f"Failed to record transaction: {str(e)}")


async def get_bank_account(currency: str):
    url = config.NEO_BANK_URL
    print(f"Retrieving bank account for currency: {currency}")

    try:
        print("Fetching bank admin details...")
        await asyncio.sleep(1)
        response = await http_get(url + "/users?name=BankAdmin")
        bank_admin = response[0]
        print("Bank admin details retrieved.")
    except Exception as e:
        raise Exception(f"Failed to retrieve bank admin: {str(e)}")

    if currency == "EUR":
        account = bank_admin["mainAccountID"]
    elif currency not in bank_admin["accountList"]:
        raise Exception(f"Bank account not found for currency {currency}")
    else:
        account = bank_admin["accountList"][currency]

    print(f"Fetching bank account details for account ID: {account}")
    await asyncio.sleep(1)
    try:
        response = await http_get(url + "/accounts?id=" + account)
        bank_account = response
        print(f"Bank account details retrieved for account ID: {account} successfully")
    except Exception as e:
        raise Exception(f"Failed to retrieve bank account: {str(e)}")

    return bank_account


async def stock_exchange_open():
    print(f"Checking if the stock exchange is open at hour: {datetime.now().hour}")
    await asyncio.sleep(1)
    if 6 < datetime.now().hour < 21:
        return True
    else:
        return False


# MOCK
async def get_rate(sell_currency: str, buy_currency: str):
    """
    Retrieve the exchange rate from sell_currency to buy_currency.
    The rates are calculated with EUR as the base currency.
    """
    print(f"Fetching exchange rate from {sell_currency} to {buy_currency}")

    try:
        # If the sell currency is EUR, we can directly get the rate
        if sell_currency == "EUR":
            rate = await get_rates("EUR", buy_currency)
            await asyncio.sleep(1)
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
    print(
        f"Starting transaction simulation: {amount} {sell_currency} to {buy_currency}"
    )

    exchange_rate = await get_rate(sell_currency, buy_currency)

    # Calculating the received amount after applying the exchange rate
    received_amount = amount * exchange_rate

    # Calculating the total cost including the transaction fee
    await asyncio.sleep(2)
    print(f"Calculated exchange rate, Received amount: {received_amount}")

    # Simulate a success or failure of the transaction with the bourse
    # transaction_success = random.choice([True, False])
    transaction_success = True

    if transaction_success:
        # If the transaction is successful, execute the transfer between the bank accounts
        print("Transaction successful, executing transfers")

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
        await asyncio.sleep(1)
        print("Transaction completed and recorded")

        return {
            "status": "success",
            "message": "Transaction succeeded.",
            "debited_amount": amount,
            "received_amount": received_amount,
        }
    else:
        # If the transaction fails, return a failure message
        print("Transaction failed: Unable to complete the transaction with the bourse.")
        return {
            "status": "failure",
            "message": "Transaction failed: Unable to complete the transaction with the bourse.",
        }


async def exchange_funds_if_needed(user_id: int, source_currency: str, amount: float):
    print(
        f"Starting fund exchange process for User ID: {user_id}, Source Currency: {source_currency}, Amount: {amount}"
    )
    url = config.NEO_BANK_URL
    try:
        print("Retrieving user details...")
        response = await http_get(url + "/users?id=" + str(user_id))
        user = response
        await asyncio.sleep(1)
        print("user : ")
        print(user)
    except Exception as e:
        print(f"Failed to retrieve user : {str(e)}")
        raise Exception(f"Failed to retrieve user: {str(e)}")

    if source_currency == "EUR":
        account = user["mainAccountID"]
    else:
        account = user["accountList"][source_currency]

    print("account id to debit : ")
    print(account)

    try:
        print("Retrieving account details for debiting...")
        await asyncio.sleep(1)
        response = await http_get(url + "/accounts?id=" + account)
        account_to_debit = response
        print("Account Fetched")

    except Exception as e:
        print(f"Failed to retrieve account to debit : {str(e)}")
        raise Exception(f"Failed to retrieve account to debit: {str(e)}")

    print("account_to_debit : ")
    print(account_to_debit)

    if account_to_debit["sold"] >= amount:
        return

    if not stock_exchange_open():
        amount_to_exchange = amount * 1.01 - account_to_debit["sold"]
    else:
        amount_to_exchange = amount - account_to_debit["sold"]

    print("amount_to_exchange : ")
    print(amount_to_exchange)

    print("Checking if we need to exchange funds")

    for key, value in user["accountList"].items():
        if key != source_currency:
            try:
                response = await http_get(url + "/accounts?id=" + value)
                account_exchange = response
            except Exception as e:
                raise Exception(f"Failed to retrieve account to credit: {str(e)}")

            print("Account details for exchange:", account_exchange)

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
                    "Executing transfer funds for sufficient balance in exchange account..."
                )
                await transfer_funds(
                    account_exchange["id"], -amount_to_exchange_with_rate
                )  # On retire les fonds du compte : 60USD
                await transfer_funds(
                    account_to_debit["id"], amount_to_exchange
                )  # On ajoute les fonds au compte : 50EUR
                return
            else:  # Si on a pas assez de fonds dans le compte
                print(
                    "Insufficient funds in exchange account, executing partial transfer..."
                )
                await transfer_funds(
                    account_exchange["id"], -account_exchange["sold"]
                )  # On retire ce qu'il y a dans le compte : 40USD
                await transfer_funds(
                    account_to_debit["id"], account_exchange["sold"] / rate
                )  # On ajoute les fonds au compte : 40USD / 1.2USD = 33.33EUR

                amount_to_exchange = (
                    amount_to_exchange - account_exchange["sold"] / rate
                )  # On a besoin de 100EUR, on a 50EUR, on a besoin de 50EUR - 33.33EUR = 16.67EUR
    await asyncio.sleep(2)
    print("Fund exchange process completed.")
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

    print("Determining transaction type...")
    if transaction_request.source_currency == transaction_request.target_currency:
        print("Executing client-to-client transaction...")
        return await execute_client_to_client_transaction(transaction_request)
    else:
        print("Executing client-to-bank transaction...")
        return await execute_client_to_bank_transaction(transaction_request)


async def execute_client_to_client_transaction(transaction_request: TransactionRequest):
    try:
        # Transfer funds from client to client
        await transfer_funds(transaction_request.idDebited, -transaction_request.amount)
        await transfer_funds(transaction_request.idCredited, transaction_request.amount)

        # Record the transaction
        print("Recording transaction...")
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
        await asyncio.sleep(1)
        print("Transaction recorded successfully.")
        return {
            "status": "success",
            "message": "Exchange process completed successfully",
            "debited_amount": transaction_request.amount,
            "received_amount": transaction_request.amount,
        }
    except Exception as e:
        print(f"Failed to execute client to client transaction: {str(e)}")
        return {
            "status": "failure",
            "message": f"An unexpected error occurred: {str(e)}",
        }


async def execute_client_to_bank_transaction(transaction_request: TransactionRequest):
    try:
        print("Retrieving bank accounts for the transaction...")
        bank_account_sell_account = await get_bank_account(
            transaction_request.source_currency
        )
        bank_account_buy_account = await get_bank_account(
            transaction_request.target_currency
        )

        # Transfer funds from client to bank (selling currency)
        print("Transferring funds from client to bank (selling currency)...")

        await transfer_funds(transaction_request.idDebited, -transaction_request.amount)
        await transfer_funds(bank_account_sell_account['id'], transaction_request.amount)
        
        # Record the client to bank transaction
        print("Recording client to bank transaction...")

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
        print("Checking stock exchange status...")
        await asyncio.sleep(1)
        if stock_exchange_open():
            print(
                "\033[92mStock exchange is open. Executing transaction with the bourse...\033[0m"
            )
            response = await simulate_bourse_transaction(
                bank_account_sell_account,
                bank_account_buy_account,
                transaction_request.amount,
                transaction_request.source_currency,
                transaction_request.target_currency,
            )
        else:
            print(
                "\033[92mStock exchange is closed. Calculating response with closed bourse rates...\033[0m"
            )
            exchange_rate = await get_rate(
                transaction_request.source_currency, transaction_request.target_currency
            )
            fees = 0.01
            # TODO: check if bank_account_buy_account has enough funds, for the POC we assume it does.
            response = {
                "status": "success",
                "message": "Bourse is closed. Transaction with stock exchange will be executed when it opens.",
                "debited_amount": transaction_request.amount,
                "received_amount": transaction_request.amount
                * exchange_rate
                * (1 - fees),
            }
            # Record the pending transaction
            print("Recording pending transactions for when the bourse opens...")
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
            print("Transaction failed:", response["message"])
            raise Exception(response["message"])

        # Transfer funds from bank to client (buying currency)
        print("Transferring funds from bank to client (buying currency)...")

        await transfer_funds(bank_account_buy_account['id'], -response["received_amount"])
        await transfer_funds(
            transaction_request.idCredited, response["received_amount"]
        )
        await asyncio.sleep(1)
        print("Funds transferred to the client.")

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

        print("\033[92mClient-to-bank exchange process completed successfully.\033[0m")

        return {
            "status": "success",
            "message": "Exchange process completed successfully",
            "debited_amount": transaction_request.amount,
            "received_amount": response["received_amount"],
        }
    except Exception as e:
        print(f"Failed to execute client to bank transaction: {str(e)}")
        return {
            "status": "failure",
            "message": f"An unexpected error occurred: {str(e)}",
        }
