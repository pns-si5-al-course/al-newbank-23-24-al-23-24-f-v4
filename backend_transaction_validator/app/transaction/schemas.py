from typing import Optional
from pydantic import BaseModel
from datetime import date

class ExchangeResponse(BaseModel):
    source_currency: str
    target_currency: str
    original_amount: float
    converted_amount: float

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