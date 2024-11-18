import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/schemas';
import { DRIZZLE_ORM } from 'src/common/constants';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from '@app/modules/users';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE_ORM) private drizzle: PostgresJsDatabase<typeof schema>) {}

  async create(dto: CreateUserDto) {
    const [{ insertedId }] = await this.drizzle
      .insert(schema.users)
      .values(dto)
      .returning({ insertedId: schema.users.id });

    return this.findById(insertedId);
  }

  async findAll() {
    return this.drizzle.query.users.findMany({
      with: {
        marketOffersSell: true,
        marketOffersBuy: true,
      },
    });
  }

  async findById(id: string) {
    return this.drizzle.query.users
      .findFirst({
        where: eq(schema.users.id, id),
      })
      .execute();
  }

  async findByEmail(email: string) {
    return this.drizzle.query.users
      .findFirst({
        where: eq(schema.users.email, email),
      })
      .execute();
  }

  async deleteById(id: string) {
    return this.drizzle.delete(schema.users).where(eq(schema.users.id, id)).execute();
  }
}
