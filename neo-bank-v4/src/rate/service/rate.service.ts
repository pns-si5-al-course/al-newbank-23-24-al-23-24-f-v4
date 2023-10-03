import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RateService {
    async getAllRates(): Promise<any[]> {
        const accessKey = '7ac90cf1fa0b1fce0a808d0ecf823037';
        const url = `http://data.fixer.io/api/latest?access_key=${accessKey}`;
        const response = await axios.get(url);
        return response.data.rates;
    }
}