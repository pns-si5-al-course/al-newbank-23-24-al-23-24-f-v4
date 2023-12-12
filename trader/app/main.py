from fastapi import FastAPI
from routers.routes import configure_routes
app = FastAPI()
configure_routes(app)

#if __name__ == "__main__":
#    import uvicorn

#    uvicorn.run(app, host="0.0.0.0", port=8001)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the trader service."}