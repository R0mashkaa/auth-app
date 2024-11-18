import { sql } from 'drizzle-orm';
import { text, pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('role', ['user', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').default(sql`gen_random_uuid()`),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: rolesEnum('role').default('user'),
  email: text('email').notNull(),
  password: text('password').notNull(),
});
