import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


const PORT = 100;
const URL = `http://localhost:${PORT}/transaction_manager/payment`;

// Lisez le contenu du fichier JSON


export const options = {
    vus: 100,
    duration: '100s',
};


export default function() {
    const body = {
        id: uuidv4(),
        idUser: 1,
        amount: 1,
        source_currency: 'USD',
        target_currency: 'USD'
    }
    const exec_id = http.post(URL, body);
}