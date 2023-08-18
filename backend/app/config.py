from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URI: str
    MONGO_INITDB_DATABASE: str
    PORT: int
    
    JWT_SECRET: str
    JWT_ALGORITHMS: str
    ACCESS_TOKEN_EXPIRES_IN: int
    
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
        
settings = Settings()