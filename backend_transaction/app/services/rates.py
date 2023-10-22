import aiohttp
from config import FIXER_API_KEY


async def get_rates():
    print(FIXER_API_KEY)
    url = f"http://data.fixer.io/api/latest?access_key={FIXER_API_KEY}"

    print(url)

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            print(data)
            return data