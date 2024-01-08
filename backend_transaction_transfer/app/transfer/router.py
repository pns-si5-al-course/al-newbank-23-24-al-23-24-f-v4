
import datetime
from fastapi import APIRouter, Body, HTTPException
from transfer import schemas
from common import http
from config import config
import asyncio

router = APIRouter()

@router.post("/transfer")
async def transactions(transaction_request: schemas.TransferRequest = Body(...)):
    try:
        accounts: schemas.Accounts = await http.http_get(f"{config.neo_bank_url}/accounts/user/{transaction_request.idUser}")

        source_currency = transaction_request.source_currency

        source_account = next((account for account in accounts if account['currency'] == source_currency), None)

        if source_account is None:
            raise HTTPException(status_code=403, detail=f"User {transaction_request.idUser} has no account in {source_currency}") #403 Forbidden

        if source_account['sold'] <= transaction_request.amount:
            raise HTTPException(status_code=403, detail=f"User {transaction_request.idUser} has not enough funds to cover the transaction") #403 Forbidden
        
        target_user = transaction_request.idUserCredited or transaction_request.idUser

        accounts: schemas.Accounts = await http.http_get(f"{config.neo_bank_url}/accounts/user/{target_user}")

        target_currency = transaction_request.target_currency
        
        target_account = next((account for account in accounts if account['currency'] == target_currency), None)

        if target_account is None:
            raise HTTPException(status_code=403, detail=f"User {target_user} has no account in {target_currency}")
        
        debit_task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
            "id": source_account['id'],
            "amount": -transaction_request.amount
        }))

        if source_currency != target_currency:
            conversion = await http.http_post(f"{config.stock_exchange_url}/exchange", {
                "source_currency": source_currency,
                "target_currency": target_currency,
                "amount": transaction_request.amount
            })
            amount_to_credit = conversion['converted_amount']
            print(f"Montant converti : {amount_to_credit}")
        else:
            amount_to_credit = transaction_request.amount

        credit_task = asyncio.create_task(http.http_post(f"{config.neo_bank_url}/accounts/executeTransaction", {
            "id": target_account['id'],
            "amount": amount_to_credit
        }))

        tasks = await asyncio.gather(debit_task, credit_task)
        
        return
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) #500 Internal Server Error