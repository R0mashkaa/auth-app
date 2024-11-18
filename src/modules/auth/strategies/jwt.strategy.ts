import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getConfig } from 'src/config';
import { UsersRepository } from 'src/modules/repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getConfig().jwt_secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Token expired');
    }

    return { id: payload.id, role: payload.role };
  }
}
