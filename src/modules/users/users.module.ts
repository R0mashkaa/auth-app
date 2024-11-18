import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from '@app/modules/redis';

const providers = [UsersService];
const imports = [RepositoryModule, RedisModule];

@Module({
  imports,
  providers,
  controllers: [UsersController],
  exports: providers,
})
export class UsersModule {}
