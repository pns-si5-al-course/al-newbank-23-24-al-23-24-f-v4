import http from 'k6/http';
import { sleep } from 'k6';
import uuid from './uuid.js';


const PORT = 100;
const URL = `http://localhost:${PORT}/transaction_manager/payment`;

// Lisez le contenu du fichier JSON


export const options = {
    vus: 1,
    duration: '1s',
};


export default function () {
    const body = {
        id: uuid.v1(),
        idUser: 1,
        amount: 1,
        source_currency: 'USD',
        target_currency: 'USD'
    }
  const exec_id = http.post(URL, body);
}