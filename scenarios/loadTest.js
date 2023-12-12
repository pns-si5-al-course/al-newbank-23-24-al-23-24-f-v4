import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 2,
    duration: '120s',
  };

export default function () {
  http.post('http://localhost:3009/payment', JSON.stringify({
    "id": "1234123412341234",
    "idUser": 1,
    "amount": 1000,
    "source_currency": "USD",
    "target_currency": "USD",
    "idCredited": ""
  }));

  http.post('http://localhost:3009/payment', JSON.stringify({
    "id": "123412341234123de4",
    "idUser": 1,
    "amount": 100,
    "source_currency": "EUR",
    "target_currency": "EUR",
    "idCredited": ""
  }));
}
