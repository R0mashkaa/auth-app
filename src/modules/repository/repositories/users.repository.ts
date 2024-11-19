import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/schemas';
import { DRIZZLE_ORM } from 'src/common/constants';
import { eq } from 'drizzle-orm';
import { CreateUserDto, UpdateMeDto } from '@app/modules/users';
import { mapToUsersResponse } from '@app/modules/users/mappers';

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
    const users = await this.drizzle.query.users.findMany({}).execute();

    return users.map(mapToUsersResponse);
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

  async updateById(id: string, data: UpdateMeDto) {
    const [{ updatedId }] = await this.drizzle
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
      .returning({ updatedId: schema.users.id });

    return this.findById(updatedId);
  }

  async queryUpdateById(id: string, data: object) {
    const [{ updatedId }] = await this.drizzle
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
      .returning({ updatedId: schema.users.id });

    return this.findById(updatedId);
  }

  async deleteById(id: string) {
    return this.drizzle.delete(schema.users).where(eq(schema.users.id, id)).execute();
  }
}
