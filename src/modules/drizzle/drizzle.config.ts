import type { Config } from 'drizzle-kit';
import { getConfig } from 'src/config';

export default {
  schema: 'src/schemas',
  out: 'src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getConfig().databaseURI,
  },
} satisfies Config;
