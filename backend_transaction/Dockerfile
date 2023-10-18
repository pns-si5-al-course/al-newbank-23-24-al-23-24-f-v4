FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /root

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app

COPY app .
# COPY lib/python lib

# RUN pytest

# RUN rm test.db

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000" ]