import aiohttp
import time
from config import FIXER_API_KEY


CACHE = {}
CACHE_EXPIRATION = 60 * 30  # 30 minutes

async def get_rates(base: str, symbols: str):
    global CACHE
    print("\033[93mFetching rates from API...\033[0m",flush=True)
    time.sleep(1)
    cache_key = f"{base}_{symbols}"
    
    # Check if rates are in cache and not expired
    if cache_key in CACHE and time.time() - CACHE[cache_key]['timestamp'] < CACHE_EXPIRATION:
        print("\033[93mUsing cached rates...\033[0m",flush=True)
        time.sleep(1)
        return CACHE[cache_key]['rates']
    
    try:
        # If not in cache or expired, fetch new rates
        if symbols == None:
            url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}&base={base}"
        else:
            url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}&base={base}&symbols={symbols}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()
                if not data.get('success'):
                    raise Exception("Failed to fetch the exchange rates :" + data.get('error').get('info'))
                
                # Update cache
                CACHE[cache_key] = {
                    'rates': data,
                    'timestamp': time.time()
                }
                print("\033[93mReturn rates fetched from API\033[0m",flush=True)
                time.sleep(1)
                return data

    except Exception as e:
        # If there is an error fetching the rates, check if they are in cache
        if cache_key in CACHE:
            print(f"\033[93mError fetching rates, using cached values: {e}\033[0m")
            return CACHE[cache_key]['rates']
        else:
            # If not in cache, re-raise the exception
            raise Exception(f"\033[93mFailed to fetch rates and no cached values available: {e}")
