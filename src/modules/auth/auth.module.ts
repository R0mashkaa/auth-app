import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getConfig } from 'src/config';
import { JwtStrategy } from './strategies';
import { UsersModule } from '@app/modules/users';
import { RepositoryModule } from '@app/modules/repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const providers = [AuthService, JwtStrategy];
const imports = [
  JwtModule.register({
    secret: getConfig().jwt_secret,
    signOptions: {
      expiresIn: parseInt(getConfig().jwt_expires),
    },
  }),
  PassportModule,
  RepositoryModule,
  UsersModule,
];

@Module({
  imports,
  providers,
  controllers: [AuthController],
  exports: [...providers],
})
export class AuthModule {}
