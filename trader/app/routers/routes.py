# app/routers/routes.py
from fastapi import APIRouter
from services.trading_service import calculate_deductions
from models.models import TradingRequest, TradingResponse

router = APIRouter()

@router.post("/trade", response_model=TradingResponse)
async def trade(request: TradingRequest):
    result = await calculate_deductions(
        request.currency_to_buy, request.amount_to_buy, request.currency_available
    )
    return result


def configure_routes(app):
    app.include_router(router)
