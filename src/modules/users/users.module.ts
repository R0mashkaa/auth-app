import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

const providers = [UsersService];
const imports = [RepositoryModule];

@Module({
  imports,
  providers,
  controllers: [UsersController],
  exports: [...providers],
})
export class UsersModule {}
