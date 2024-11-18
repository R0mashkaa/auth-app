import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoggerServiceDecorator } from 'src/common';
import { AuthResponse, SignInDto, SignUpDto } from './dto';
import { UsersResponse, UsersService } from 'src/modules/users';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @LoggerServiceDecorator()
  async signIn(data: SignInDto): Promise<AuthResponse> {
    try {
      const existsUser = await this.usersService.findByEmail(data.email);

      if (!existsUser) {
        throw new NotFoundException('User not found');
      }

      const isPasswordCorrect = await bcrypt.compare(data.password, existsUser.password);
      if (!isPasswordCorrect) {
        throw new BadRequestException('Password incorrect');
      }

      const payload = {
        id: existsUser.id,
        firstName: existsUser.firstName,
        lastName: existsUser.lastName,
        email: existsUser.email,
      };

      return {
        ...existsUser,
        access_token: this.jwtService.sign(payload),
      } as AuthResponse;
    } catch (error) {
      console.error('Error sign in:', error);
      throw new BadRequestException(`[signIn-Auth] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async signUp(data: SignUpDto): Promise<AuthResponse> {
    try {
      const existsUser = await this.usersService.findByEmail(data.email);

      if (existsUser) {
        throw new BadRequestException('User already registered');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const createdUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
      });

      const payload = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
      };

      return {
        ...existsUser,
        access_token: this.jwtService.sign(payload),
      } as AuthResponse;
    } catch (error) {
      throw new BadRequestException(`[signUp-Auth] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async verify(userId: string): Promise<UsersResponse> {
    try {
      const existsUser = await this.usersService.findById(userId);

      if (!existsUser) {
        throw new NotFoundException('User not found');
      }

      return existsUser;
    } catch (error) {
      throw new BadRequestException(`[verify-Auth] error: ${error.message}`);
    }
  }
}
