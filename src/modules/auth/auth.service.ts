import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoggerServiceDecorator } from 'src/common';
import { AuthResponse, PasswordUpdate, SignInDto, SignUpDto } from './dto';
import { UsersResponse } from 'src/modules/users';
import { UsersRepository } from '@app/modules';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  @LoggerServiceDecorator()
  async signIn(data: SignInDto): Promise<AuthResponse> {
    try {
      const existsUser = await this.usersRepository.findByEmail(data.email);

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
        role: existsUser.role,
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
      const existsUser = await this.usersRepository.findByEmail(data.email);

      if (existsUser) {
        throw new BadRequestException('User already registered');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const createdUser = await this.usersRepository.create({
        ...data,
        password: hashedPassword,
      });

      const payload = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: existsUser.role,
        email: createdUser.email,
      };

      return {
        ...createdUser,
        access_token: this.jwtService.sign(payload),
      } as AuthResponse;
    } catch (error) {
      throw new BadRequestException(`[signUp-Auth] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async changePassword(data: PasswordUpdate, userId: string): Promise<object> {
    try {
      const { previousPassword, newPassword, confirmNewPassword } = data;
      const existsUser = await this.usersRepository.findById(userId);

      const isPasswordCorrect = await bcrypt.compare(previousPassword, existsUser.password);
      if (!isPasswordCorrect) {
        throw new BadRequestException('Password incorrect');
      }

      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException('New password doesn`t matches');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.queryUpdateById(userId, { password: hashedPassword });

      const payload = {
        id: existsUser.id,
        firstName: existsUser.firstName,
        lastName: existsUser.lastName,
        role: existsUser.role,
        email: existsUser.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(`[roleUpdate-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async verify(userId: string): Promise<UsersResponse> {
    try {
      const existsUser = await this.usersRepository.findById(userId);

      if (!existsUser) {
        throw new NotFoundException('User not found');
      }

      return existsUser;
    } catch (error) {
      throw new BadRequestException(`[verify-Auth] error: ${error.message}`);
    }
  }
}
