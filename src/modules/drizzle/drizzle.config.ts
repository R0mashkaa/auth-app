import type { Config } from 'drizzle-kit';
import { getConfig } from '@app/config';

export default {
  schema: 'src/schemas',
  out: 'src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getConfig().databaseURI,
  },
} satisfies Config;
