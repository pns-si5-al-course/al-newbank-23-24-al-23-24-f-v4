
from fastapi import APIRouter, Body, HTTPException
from services import execute_transaction, execute_transaction_simulation
from schemas import TransactionRequest

router = APIRouter()

@router.post("/transactions")
async def transactions(transaction_request: TransactionRequest = Body(...)):
    try:
        result = await execute_transaction(transaction_request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))