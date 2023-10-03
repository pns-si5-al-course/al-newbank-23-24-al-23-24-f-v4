import {Get, Controller} from '@nestjs/common';
import {RateService} from '../service/rate.service';


@Controller("rates")
export class RateController {
    constructor(private readonly rateService: RateService) {}

    @Get()
    getAllRates(): Promise<any[]> {
        // return rates exchange with base EUR
        return this.rateService.getAllRates();
    }
}