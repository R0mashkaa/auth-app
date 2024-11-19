import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@app/schemas';
import { DRIZZLE_ORM } from '@app/common/constants';
import { eq } from 'drizzle-orm';
import { CreateUserDto, UpdateMeDto } from '@app/modules/users';
import { mapToUsersResponse } from '@app/modules/users/mappers';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE_ORM) private drizzle: PostgresJsDatabase<typeof schema>) {}

  async create(dto: CreateUserDto) {
    try {
      const [{ insertedId }] = await this.drizzle
        .insert(schema.users)
        .values(dto)
        .returning({ insertedId: schema.users.id });

      return this.findById(insertedId);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating user: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await this.drizzle.query.users.findMany({}).execute();
      return users.map(mapToUsersResponse);
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching users: ${error.message}`);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.drizzle.query.users
        .findFirst({
          where: eq(schema.users.id, id),
        })
        .execute();
      return user || null;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user by id: ${error.message}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.drizzle.query.users
        .findFirst({
          where: eq(schema.users.email, email),
        })
        .execute();
      return user || null;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user by email: ${error.message}`);
    }
  }

  async updateById(id: string, data: UpdateMeDto) {
    try {
      const [{ updatedId }] = await this.drizzle
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, id))
        .returning({ updatedId: schema.users.id });

      return updatedId ? await this.findById(updatedId) : null;
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user: ${error.message}`);
    }
  }

  async queryUpdateById(id: string, data: object) {
    try {
      const [{ updatedId }] = await this.drizzle
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, id))
        .returning({ updatedId: schema.users.id });

      return updatedId ? this.findById(updatedId) : null;
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user with query: ${error.message}`);
    }
  }

  async deleteById(id: string) {
    try {
      const result = await this.drizzle
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .execute();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error.message}`);
    }
  }
}
