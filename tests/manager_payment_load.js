import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


const PORT = 100;
const URL = `http://localhost:${PORT}/transaction_manager/payment`;


export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            preAllocatedVUs: 100,
            timeUnit: '1s',
            startRate: 50,
            stages: [
                { target: 200, duration: '30s' }, // linearly go from 50 iters/s to 200 iters/s for 30s
                { target: 500, duration: '0' }, // instantly jump to 500 iters/s
                { target: 300, duration: '30m' }, // continue with 300 iters/s for 10 minutes
            ],
        },
    },
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