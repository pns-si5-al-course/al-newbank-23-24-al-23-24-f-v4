from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import transaction

app = FastAPI()

# Middleware for handling CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Including the routers
app.include_router(transaction.router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the transaction service."}