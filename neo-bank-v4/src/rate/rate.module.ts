import { Module } from '@nestjs/common';
import { RateController } from './controller/rate.controller';
import { RateService } from './service/rate.service';

@Module({
    controllers: [RateController],
    providers: [RateService],
})
export class RateModule {}
