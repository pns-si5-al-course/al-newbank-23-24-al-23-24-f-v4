import { collectDefaultMetrics, register } from 'prom-client';
import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  constructor() {
    // Collect default metrics (CPU, Heap, Event Loop, etc.)
    collectDefaultMetrics();
  }
  @Get()
  getMetrics() {
    return register.metrics();
  }
}
