from pydantic import BaseModel


class TradingRequest(BaseModel):
    currency_to_buy: str
    amount_to_buy: float
    currency_available: dict


class TradingResponse(BaseModel):
    amount_bought: float
    currencies_debited: dict
