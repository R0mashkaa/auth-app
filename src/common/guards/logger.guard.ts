import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerGuard implements CanActivate {
  private readonly logger = new Logger('HTTP');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const className = context.getClass().name;
    const request = context.switchToHttp().getRequest();
    const methodKey = context.getHandler().name;

    const sanitizedBody = { ...request.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[HIDDEN]';
    }

    const req = {
      className,
      method: request.method,
      originalUrl: request.originalUrl,
      params: request.params,
      body: request.body,
    };

    const message = `${req.method} [${className}] {${methodKey}} ${
      JSON.stringify(req.params) !== '{}' ? `Params: ${JSON.stringify(req.params)}` : ''
    } ${JSON.stringify(sanitizedBody) !== '{}' ? `Body: ${JSON.stringify(sanitizedBody)}` : ''}`;

    this.logger.log(message);

    return true;
  }
}
