import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LogHttp implements NestMiddleware {
  private readonly logger = new Logger(LogHttp.name);

  use(req: Request, res: Response, next: () => void) {
    const startReqTime = Date.now();

    res.once('finish', () => {
      const { method, url } = req;
      const { statusCode } = res;
      const responseTimeInSeconds = (Date.now() - startReqTime) / 1000;

      this.logger.log(
        `Request Res: (res time: ${responseTimeInSeconds} sec) ${method} ${url} ${statusCode}`,
      );
    });

    next();
  }
}
