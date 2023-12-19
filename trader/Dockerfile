FROM python:3.11.5-slim-bullseye AS prod
#RUN apt update && apt install -y gcc libpq-dev

WORKDIR /root

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app

COPY .env .
COPY app .

# RUN pytest

ENTRYPOINT [ "uvicorn", "main:app", "--host", "0.0.0.0" ]

CMD [ "--port", "8001" ]

FROM prod AS dev

RUN echo "abc"
