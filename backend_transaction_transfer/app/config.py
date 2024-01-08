import pydantic_settings 

class Config(pydantic_settings.BaseSettings):
    neo_bank_url: str
    stock_exchange_url: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

config = Config()
