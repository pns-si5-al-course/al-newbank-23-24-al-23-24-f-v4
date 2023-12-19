import pydantic_settings


class Config(pydantic_settings.BaseSettings):
    fixer_api_key: str
    base_url: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    redis_host: str = "redis"
    redis_port: int = 6379


config = Config()
print("Debug - API Key:", config.fixer_api_key)
print("Debug - Base URL:", config.base_url)
