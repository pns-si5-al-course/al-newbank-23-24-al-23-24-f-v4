import aiohttp
import time
from config import FIXER_API_KEY


CACHE = {}
CACHE_EXPIRATION = 60 * 30  # 30 minutes

async def get_rates(base: str, symbols: str):
    global CACHE
    
    cache_key = f"{base}_{symbols}"
    
    # Check if rates are in cache and not expired
    if cache_key in CACHE and time.time() - CACHE[cache_key]['timestamp'] < CACHE_EXPIRATION:
        #print("Fetching rates from cache !")
        return CACHE[cache_key]['rates']
    
    # If not in cache or expired, fetch new rates
    url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}&base={base}&symbols={symbols}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            if not data.get('success'):
                raise Exception("Failed to fetch the exchange rates.")
            
            # Update cache
            CACHE[cache_key] = {
                'rates': data,
                'timestamp': time.time()
            }
            return data