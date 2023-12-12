import asyncio
import httpx
from config.config import STOCK_EXCHANGE_SERVICE_URL
import logging

logging.basicConfig(level=logging.INFO)


async def get_exchange_rate(
    source_currency: str, target_currency: str, amount: float
) -> float:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{STOCK_EXCHANGE_SERVICE_URL}/exchange",
                json={
                    "source_currency": source_currency,
                    "target_currency": target_currency,
                    "amount": amount,
                },
            )
            response.raise_for_status()  # Will raise an HTTPError for 4xx/5xx responses
            data = response.json()
            logging.info(STOCK_EXCHANGE_SERVICE_URL)

            return data["converted_amount"]
    except Exception as e:
        logging.error(f"Error fetching exchange rate: {e}")
        raise


async def calculate_deductions(currency_to_buy, amount_to_buy, currency_available):
    initial_rate_currency = "EUR" if currency_to_buy != "EUR" else "USD"
    deductions = {}
    total_amount_bought = 0
    remaining_amount = amount_to_buy

    try:
        # Fetch the initial exchange rate
        logging.info("Fetching initial exchange rate...")
        initial_rate = await get_exchange_rate(
            initial_rate_currency, currency_to_buy, 1
        )
        logging.info(f"Initial rate fetched: {initial_rate}")

        for currency, amount in currency_available.items():
            if currency == currency_to_buy:
                deduct = min(amount, remaining_amount)
                deductions[currency] = deductions.get(currency, 0) - deduct
                total_amount_bought += deduct
                remaining_amount -= deduct
            else:
                converted_amount = await get_exchange_rate(
                    currency, currency_to_buy, amount
                )
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

        final_rate = await get_exchange_rate(initial_rate_currency, currency_to_buy, 1)
        logging.info(f"Final rate fetched: {final_rate}")
        logging.info(f"total: {total_amount_bought}")

        rate_difference = final_rate - initial_rate
        adjusted_total = total_amount_bought * (1 + rate_difference / initial_rate)

        if adjusted_total < amount_to_buy:
            return {"error": "Insufficient funds after rate adjustment."}

    except httpx.HTTPError as e:
        return {
            "amount_bought": 0,
            "currencies_debited": {},
            "error": "Unable to connect to the stock exchange service. Please try again later.",
        }
    except Exception as e:
        return {"amount_bought": 0, "currencies_debited": {}, "error": str(e)}

    if total_amount_bought > 0:
        return {"amount_bought": total_amount_bought, "currencies_debited": deductions}
    else:
        # other issue
        return {
            "amount_bought": 0,
            "currencies_debited": {},
            "error": "Unable to perform currency conversion.",
        }
