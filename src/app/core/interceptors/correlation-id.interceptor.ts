import { HttpInterceptorFn } from '@angular/common/http';

let counter = 0;

function generateCorrelationId(): string {
  counter++;
  return `fe-${Date.now()}-${counter}-${Math.random().toString(36).substring(2, 8)}`;
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  const correlationId = generateCorrelationId();
  const cloned = req.clone({
    setHeaders: { 'X-Correlation-ID': correlationId },
  });
  return next(cloned);
};
