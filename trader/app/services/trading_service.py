import logging
import os
import httpx
import pymongo
from datetime import datetime
from config.config import STOCK_EXCHANGE_SERVICE_URL

logging.basicConfig(level=logging.INFO)

mongo_simulations_uri = os.getenv(
    "MONGO_SIMULATIONS_URI", "mongodb://mongo_db_simulations:27017/"
)
mongo_client = pymongo.MongoClient(mongo_simulations_uri)
db = mongo_client["trader_simulations_db"]
simulations_collection = db["simulations"]


def is_exchange_open() -> bool:
    now = datetime.now()
    logging.info(now.hour)
    return not (now.hour >= 21 or now.hour < 6)


async def get_exchange_rate(
    source_currency: str, target_currency: str, amount: float
) -> dict:
    endpoint = "/simulate" if not is_exchange_open() else "/exchange"
    status = "simulation" if endpoint == "/simulate" else "transaction"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{STOCK_EXCHANGE_SERVICE_URL}{endpoint}",
                json={
                    "source_currency": source_currency,
                    "target_currency": target_currency,
                    "amount": amount,
                },
            )
            response.raise_for_status()
            data = response.json()
            converted_amount = data["converted_amount"]

            if endpoint == "/simulate":
                logging.info("Performing Simulation")
                converted_amount *= 1.01

                simulation_data = {
                    "source_currency": source_currency,
                    "target_currency": target_currency,
                    "amount": amount,
                    "converted_amount": converted_amount,
                    "timestamp": datetime.now(),
                }
                simulations_collection.insert_one(simulation_data)

            return {"converted_amount": converted_amount, "status": status}
    except Exception as e:
        logging.error(f"Error fetching exchange rate: {e}")
        raise


async def calculate_deductions(currency_to_buy, amount_to_buy, currency_available):
    deductions = {}
    total_amount_bought = 0
    remaining_amount = amount_to_buy
    operation_status = "transaction"

    try:
        for currency, amount in currency_available.items():
            if currency == currency_to_buy:
                deduct = min(amount, remaining_amount)
                deductions[currency] = deductions.get(currency, 0) - deduct
                total_amount_bought += deduct
                remaining_amount -= deduct
            else:
                exchange_result = await get_exchange_rate(
                    currency, currency_to_buy, amount
                )
                converted_amount = exchange_result["converted_amount"]

                # Update the status if any simulation occurs
                if exchange_result["status"] == "simulation":
                    operation_status = "simulation"

                amount_to_use = min(converted_amount, remaining_amount)
                required_amount_from_currency = amount_to_use / (
                    converted_amount / amount
                )
                deductions[currency] = (
                    deductions.get(currency, 0) - required_amount_from_currency
                )
                total_amount_bought += amount_to_use
                remaining_amount -= amount_to_use

            if remaining_amount <= 0:
                break

    except Exception as e:
        return {
            "amount_bought": 0,
            "currencies_debited": {},
            "error": str(e),
            "status": "error",
        }

    if total_amount_bought > 0:
        return {
            "amount_bought": total_amount_bought,
            "currencies_debited": deductions,
            "status": operation_status,
        }
    else:
        return {
            "amount_bought": 0,
            "currencies_debited": {},
            "error": "Unable to perform currency conversion.",
            "status": "error",
        }
