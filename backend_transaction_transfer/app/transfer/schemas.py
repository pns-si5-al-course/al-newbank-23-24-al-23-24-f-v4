from typing import Optional
from pydantic import BaseModel
from datetime import date

class TransferRequest(BaseModel):
    id : str
    idUser: int
    amount: float
    source_currency: str
    target_currency: str
    idUserCredited: Optional[str] = None

class Account(BaseModel):
    id: int
    idUser: int
    sold: float
    currency: str

class Accounts(BaseModel):
    accounts: list[Account]