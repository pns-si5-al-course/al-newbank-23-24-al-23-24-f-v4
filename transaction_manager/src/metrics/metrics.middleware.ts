import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpResponseStatus: Counter<string>;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10], // Exemple de buckets en secondes
    });

    this.httpResponseStatus = new Counter({
      name: 'http_response_status',
      help: 'Counts of HTTP response statuses',
      labelNames: ['status'],
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime();

    res.on('finish', () => {
      this.httpRequestsTotal.inc({
        method: req.method,
        path: req.route.path,
        status: res.statusCode,
      });

      const duration = process.hrtime(start);
      const durationInSeconds = duration[0] + duration[1] / 1e9;

      this.httpRequestDuration.observe({
        method: req.method,
        path: req.route.path,
        status: res.statusCode,
      }, durationInSeconds);
      this.httpResponseStatus.inc({ status: res.statusCode.toString() });
    });

    next();
  }
}
