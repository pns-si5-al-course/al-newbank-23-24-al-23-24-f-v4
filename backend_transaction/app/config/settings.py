import os
from dotenv import load_dotenv

load_dotenv()

FIXER_API_KEY = os.getenv("FIXER_API_KEY")
NEO_BANK_URL = os.getenv("NEO_BANK_URL")