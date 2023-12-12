
import datetime
from fastapi import APIRouter, Body, HTTPException
from transaction import schemas
from common import http
from config import config
import asyncio

router = APIRouter()

@router.post("/transactions")
async def transactions(transaction_request: schemas.TransactionRequest = Body(...)):
    tasks = []
    try:
        #workflow :
        #1. Get user accounts
        accounts: schemas.Accounts = await http.http_get(f"{config.neo_bank_url}/accounts/user/{transaction_request.idUser}")

        #2. Transform funds from other accounts to source currency to cover the transaction (we don't focus on target_account for now)

        source_currency = transaction_request.source_currency

        source_account = next((account for account in accounts if account['currency'] == source_currency), None)

        if source_account is None:
            raise Exception(f"User {transaction_request.idUser} has no account in {source_currency}")
        
        if source_account['sold'] >= transaction_request.amount:
            await http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
                "id": source_account['id'],
                "amount": -transaction_request.amount
            })
            return

        amount_needed = transaction_request.amount - source_account['sold']

        if 6 < datetime.datetime.now().hour < 21:
            # if stock exchange is closed, we store the transaction in the database and process it later (cron job)
            task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/transactions", transaction_request.dict()))
            tasks.append(task)

        conversion : schemas.ConversionResponse = await http.http_post(f"{config.trader_url}/trade", {
            "currency_to_buy" : source_currency,
            "amount_to_buy" : amount_needed,
            "currency_available" :  {account['currency']: account['sold'] for account in accounts if account['sold'] > 0 and account['currency'] != source_currency}
        })

        amount_converted = conversion['amount_bought']
        print(f"amount converted : {amount_converted}")

        if amount_converted < amount_needed:
            raise Exception(f"User {transaction_request.idUser} has not enough funds to cover the transaction")
        
        #3. Add the excess funds to the user account
        excess = amount_converted - amount_needed

        print(f"excess : {excess}")

        if excess > 0:
            task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
                "id": source_account['id'],
                "amount": excess
            }))
            tasks.append(task)
        
        #4. Execute the transaction : debit the source account

        print("currencies debited : ")
        print(conversion['currencies_debited'].items())

        for currency, amount in conversion['currencies_debited'].items():
            if amount != 0:
                task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
                    "id": next((account for account in accounts if account['currency'] == currency), None)['id'],
                    "amount": amount
                }))
                tasks.append(task)
        
        task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
            "id": source_account['id'],
            "amount": -source_account['sold']
        }))

        #5. Credit the target account
        if(transaction_request.idCredited is not None):
            task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
                "id": transaction_request.idCredited,
                "amount": transaction_request.amount
            }))

        else:
            # If no target account, we credit the bank account id with the target currency
            #TODO : credit the bank account
            print("bank account credited")

        print("Transactions executed")

        await asyncio.gather(*tasks)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))