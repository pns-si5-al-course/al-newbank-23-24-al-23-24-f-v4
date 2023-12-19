import httpx
import redis
from config import config
import logging

logging.basicConfig(level=logging.INFO)


redis_client = redis.Redis(host=config.redis_host, port=config.redis_port, db=0)


def fetch_rates_from_api() -> dict:
    response = httpx.get(f"{config.base_url}/latest?access_key={config.fixer_api_key}")
    data = response.json()

    if "error" in data:
        raise Exception(f"API Error: {data['error']}")

    return data.get("rates", {})


def get_exchange_rate(source_currency: str, target_currency: str) -> float:
    cache_key = "exchange_rates"

    cached_rates = redis_client.get(cache_key)
    if cached_rates:
        logging.info("Serving from cache.")
        rates = eval(cached_rates)
    else:
        logging.info("Fetching from API.")
        rates = fetch_rates_from_api()
        redis_client.setex(cache_key, 2700, str(rates))  # Cache for 45 minutes

    if source_currency == "EUR":
        return rates.get(target_currency, 0)
    elif source_currency in rates and target_currency in rates:
        rate_to_eur = rates[source_currency]
        rate_from_eur = rates[target_currency]
        return rate_from_eur / rate_to_eur
    else:
        raise ValueError(
            f"Exchange rate not found for {source_currency} to {target_currency}."
        )
