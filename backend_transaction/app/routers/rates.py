
from fastapi import APIRouter, Body, HTTPException
from services import get_rates

router = APIRouter()

@router.get("/rates")
async def rates():
    try:
        result = await get_rates()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
