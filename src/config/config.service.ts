import { getSafeEnv } from 'src/common/utils';

export const getConfig = () => {
  return {
    node_env: getSafeEnv('NODE_ENV'),
    allowedOrigins: getSafeEnv('ALLOWED_ORIGINS'),

    databaseURI: getSafeEnv('DATABASE_URI'),
    host: getSafeEnv('HOST'),
    port: getSafeEnv('PORT'),

    jwt_secret: getSafeEnv('JWT_SECRET'),
    jwt_expires: getSafeEnv('JWT_EXPIRES'),
  };
};
