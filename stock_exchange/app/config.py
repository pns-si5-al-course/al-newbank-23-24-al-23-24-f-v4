import pydantic_settings 

class Config(pydantic_settings.BaseSettings):
    fixer_api_key: str
    base_url : str
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

config = Config()
