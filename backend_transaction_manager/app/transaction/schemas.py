from typing import Optional
from pydantic import BaseModel
from datetime import date

class PaymentRequest(BaseModel):
    id : str
    idUser: int
    amount: float
    source_currency: str
    target_currency: str
    idCredited : Optional[str] = None


class TransactionRequest(BaseModel):
    idUser: int
    idCredited : Optional[str] = None
    source_currency: str
    target_currency: str
    amount: float

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
    amount_buyed: float
    currencies_debited: CurrenciesDebited