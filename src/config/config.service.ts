import { getSafeEnv } from 'src/common/utils';

export const getConfig = () => {
  return {
    node_env: getSafeEnv('NODE_ENV'),
    allowedOrigins: getSafeEnv('ALLOWED_ORIGINS'),

    databaseURI: getSafeEnv('DATABASE_URI'),
    host: getSafeEnv('HOST'),
    port: getSafeEnv('PORT'),

    redis_host: getSafeEnv('REDIS_HOST'),
    redis_username: getSafeEnv('REDIS_USERNAME'),
    redis_password: getSafeEnv('REDIS_PASSWORD'),
    redis_port: Number(getSafeEnv('REDIS_PORT')),

    jwt_secret: getSafeEnv('JWT_SECRET'),
    jwt_expires: getSafeEnv('JWT_EXPIRES'),
  };
};
