import aiohttp

async def http_get(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                response_text = await response.text()
                raise Exception(
                    f"Failed to retrieve data from {url}. Status : {response.status}, response : {response_text}"
                )

            return response


async def http_post(url: str, data: dict):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            return response
