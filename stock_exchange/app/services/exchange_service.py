import httpx
from config import config

async def get_exchange_rate(source_currency: str, target_currency: str) -> float:

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{config.base_url}/latest?access_key={config.fixer_api_key}")
        data = response.json()

        if "error" in data:
            raise Exception(f"API Error: {data['error']}")

        rates = data.get("rates", {})

        if source_currency == "EUR":
            return rates.get(target_currency, 0)

        if source_currency in rates and target_currency in rates:
            rate_to_eur = rates[source_currency]
            rate_from_eur = rates[target_currency]
            return rate_from_eur / rate_to_eur

        raise ValueError(
            f"Exchange rate not found for {source_currency} to {target_currency}."
        )
