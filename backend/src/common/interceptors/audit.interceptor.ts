import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: async () => {
          // Only audit sensitive endpoints
          const auditPaths = ['/api/predict', '/api/auth', '/api/settings', '/api/admin'];
          const shouldAudit = auditPaths.some(path => request.url.startsWith(path));

          if (shouldAudit) {
            try {
              await this.prisma.auditLog.create({
                data: {
                  userId: request.user?.id || null,
                  action: request.method,
                  resource: this.extractResource(request.url),
                  resourceId: request.params?.id || null,
                  method: request.method,
                  path: request.url,
                  statusCode: response.statusCode,
                  ipAddress: request.ip,
                  userAgent: request.get('user-agent'),
                  requestId: request['requestId'],
                  metadata: {
                    body: this.sanitizeBody(request.body),
                    query: request.query,
                    responseTime: Date.now() - startTime,
                  },
                },
              });
            } catch (error) {
              // Don't fail the request if audit logging fails
              console.error('Audit logging failed:', error);
            }
          }
        },
      }),
    );
  }

  private extractResource(url: string): string {
    const parts = url.split('/');
    return parts[2] || 'unknown'; // /api/resource
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
