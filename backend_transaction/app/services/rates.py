import aiohttp
from config import FIXER_API_KEY


async def get_rates(base: str, symbols: str):
    
    if symbols is None:
        url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}&base={base}"
    else:
        url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}&base={base}&symbols={symbols}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            if not data.get('success'):
                raise Exception("Failed to fetch the exchange rates.")
            return data
