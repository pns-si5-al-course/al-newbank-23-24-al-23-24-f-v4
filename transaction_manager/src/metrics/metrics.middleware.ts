import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly httpRequestsTotal: Counter<string>;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      this.httpRequestsTotal.inc({
        method: req.method,
        path: req.route.path,
        status: res.statusCode,
      });
    });

    next();
  }
}
