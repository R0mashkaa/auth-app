import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getConfig } from '@app/config';
import { UsersRepository } from '@app/modules/repository';
import { ApiJwtPayload } from '@app/common/decorators';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getConfig().jwt_secret,
    });
  }

  async validate(payload: ApiJwtPayload) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Token expired');
    }

    return {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
    };
  }
}
