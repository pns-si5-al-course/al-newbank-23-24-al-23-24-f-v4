
import datetime
from fastapi import APIRouter, Body, HTTPException
from transaction import schemas
from common import http
from config import config
import asyncio

router = APIRouter()

@router.post("/transaction/validate")
async def transactions(transaction_request: schemas.TransactionRequest = Body(...)):
    try:

        accounts: schemas.Accounts = await http.http_get(f"{config.neo_bank_url}/accounts/user/{transaction_request.idUser}")

        source_currency = transaction_request.source_currency

        source_account = next((account for account in accounts if account['currency'] == source_currency), None)

        if source_account is None:
            raise HTTPException(status_code=403, detail=f"User {transaction_request.idUser} has no account in {source_currency}") #403 Forbidden
        
        if(transaction_request.amount < 10): #TODO : change this value depending on the currency
            return #200

        
        
        if source_account['sold'] >= transaction_request.amount:
            return #200

        amount_needed = transaction_request.amount - source_account['sold']

        for account in accounts:
            if account['currency'] != source_currency:
                conversion : schemas.ExchangeResponse = await http.http_post(f"{config.stock_exchange_url}/simulate", { #TODO : change with url of stock exchange when it will be developed and also the DTO
                    "source_currency" : account['currency'],
                    "target_currency" : source_currency,
                    "amount" : account['sold']
                })

                amount_needed -= conversion['converted_amount']
                if amount_needed <= 0:
                    print(f"User {transaction_request.idUser} has enough funds to cover the transaction")
                    return #200
                
        if amount_needed > 0:
            print(f"User {transaction_request.idUser} has not enough funds to cover the transaction")
            raise HTTPException(status_code=403, detail="User has not enough funds to cover the transaction")
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) #500 Internal Server Error