import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle';
import { UsersRepository } from './repositories';

const providers = [UsersRepository];

@Module({
  imports: [DrizzleModule],
  providers,
  exports: providers,
})
export class RepositoryModule {}
