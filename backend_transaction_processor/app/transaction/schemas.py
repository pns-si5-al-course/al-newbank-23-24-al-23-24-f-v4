from typing import Optional
from pydantic import BaseModel
from datetime import date


class TransactionRequest(BaseModel):
    id : str
    idUser: int
    amount: float
    source_currency: str
    target_currency: str
    idCredited : Optional[str] = None


class Account(BaseModel):
    id: int
    idUser: int
    sold: float
    currency: str

class Accounts(BaseModel):
    accounts: list[Account]

class CurrenciesDebited(BaseModel):
    currencies: dict[str, float]

class ConversionResponse(BaseModel):
    amount_bought: float
    currencies_debited: CurrenciesDebited