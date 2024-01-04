import http from 'k6/http';
import { sleep } from 'k6';

const PORT = 100;
const URL = `http://localhost:${PORT}/transaction_manager/`;

// Lisez le contenu du fichier JSON


export const options = {
    vus: 100,
    duration: '50s',
};


export default function () {
  const exec_id = http.get(URL);
}