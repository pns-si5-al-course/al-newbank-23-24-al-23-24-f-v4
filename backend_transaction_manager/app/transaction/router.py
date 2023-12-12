
import datetime
from fastapi import APIRouter, Body, HTTPException
from fastapi import BackgroundTasks
from transaction import schemas
from common import http
from config import config
import asyncio

router = APIRouter()

async def process_transaction_and_followup(transaction_url, payment_data):
    # Effectuer la demande HTTP
    response = await http.http_post(transaction_url, payment_data)

    if response.status == 200:
        pass
        #print("Transaction processed successfully")
    else:
        pass
        #print("Transaction failed")

@router.post("/payment")
async def payment(background_tasks: BackgroundTasks, payment_request: schemas.PaymentRequest = Body(...)):
    try:
        # Ask validator if the payment can proceed
        response = await http.http_post(f"{config.transaction_validator_url}/transaction/validate", payment_request.dict())

        if response.status == 200:
            # Ajout de la tâche en arrière-plan au lieu de l'attendre
            print("Payment request accepted, process transaction and followup")
            transaction_url = f"{config.transaction_processor_url}/transactions"
            background_tasks.add_task(process_transaction_and_followup, transaction_url, payment_request.model_dump())
        else:
            print("Payment request rejected")
            print(response.status)
            raise HTTPException(status_code=403, detail="The payment can't proceed")
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Gérer les exceptions ici si nécessaire
        raise HTTPException(status_code=500, detail=str(e))