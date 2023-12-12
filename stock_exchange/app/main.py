from fastapi import FastAPI
from routes import router as exchange_router



app = FastAPI()
app.include_router(exchange_router)

#if __name__ == "__main__":
#    import uvicorn

#    uvicorn.run(app, host="0.0.0.0", port=8000)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the stock exchange service."}