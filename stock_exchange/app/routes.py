from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.exchange_service import get_exchange_rate

router = APIRouter()


class ExchangeRequest(BaseModel):
    source_currency: str
    target_currency: str
    amount: float


@router.post("/exchange")
async def exchange(request: ExchangeRequest):
    exchange_rate = await get_exchange_rate(
        request.source_currency, request.target_currency
    )
    converted_amount = request.amount * exchange_rate
    return {
        "source_currency": request.source_currency,
        "target_currency": request.target_currency,
        "original_amount": request.amount,
        "converted_amount": converted_amount,
    }

@router.post("/simulate")
async def exchange(request: ExchangeRequest):
    exchange_rate = await get_exchange_rate(
        request.source_currency, request.target_currency
    )
    converted_amount = request.amount * exchange_rate
    return {
        "source_currency": request.source_currency,
        "target_currency": request.target_currency,
        "original_amount": request.amount,
        "converted_amount": converted_amount,
    }
