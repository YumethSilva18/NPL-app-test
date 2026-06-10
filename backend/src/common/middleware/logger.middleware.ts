import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../config/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggerService('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req['requestId'];

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      
      const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${ip} ${userAgent}`;
      
      if (statusCode >= 500) {
        this.logger.error(message, '', requestId);
      } else if (statusCode >= 400) {
        this.logger.warn(message, requestId);
      } else {
        this.logger.log(message, requestId);
      }
    });

    next();
  }
}
