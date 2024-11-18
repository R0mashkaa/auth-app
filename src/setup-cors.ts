import { INestApplication } from '@nestjs/common';
import { getConfig } from './config';

export function setupCors(app: INestApplication): void {
  const config = getConfig();
  const isProduction = config.node_env === 'production';
  const allowedOrigins = config.allowedOrigins;
  const originList = allowedOrigins?.split(',').map(origin => origin.trim());

  if (isProduction) {
    if (!originList || originList.length === 0) {
      throw new Error('CORS setup failed: allowedOrigins is not configured correctly.');
    }

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || originList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS error: Origin ${origin} is not allowed`));
        }
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  } else {
    const devAllowedOrigins = [
      `http://localhost:${config.port}`,
      `http://127.0.0.1:${config.port}`,
    ];
    app.enableCors({
      origin: devAllowedOrigins,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  }
}
