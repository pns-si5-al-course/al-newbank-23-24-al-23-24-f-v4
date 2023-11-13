from pydantic import BaseModel
from datetime import date

class Transaction(BaseModel):
    type: str
    idDebited: str
    idCredited: str
    amount: float
    currency: str
    date: date

class TransactionRequest(BaseModel):
    idUser: int
    idDebited : str
    idCredited : str
    source_currency: str
    target_currency: str
    amount: float