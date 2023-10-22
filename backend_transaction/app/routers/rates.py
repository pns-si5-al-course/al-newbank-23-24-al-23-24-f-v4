
from typing import Optional
from fastapi import APIRouter, Body, HTTPException
from services import get_rates

router = APIRouter()

@router.get("/rates")
async def rates(base: str, symbols: Optional[str] = None):
    try: 
        result = await get_rates(base, symbols)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
