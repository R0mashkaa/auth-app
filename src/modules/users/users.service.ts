import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerServiceDecorator } from '@app/common';
import { CreateUserDto, UpdateMeDto, UsersResponse } from './dto';
import { UsersRepository } from '../repository';
import { RolesEnum } from './enums';
import { RedisService } from '@app/modules/redis';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private redisService: RedisService,
  ) {}

  @LoggerServiceDecorator()
  async create(data: CreateUserDto): Promise<UsersResponse> {
    try {
      return await this.usersRepository.create(data);
    } catch (error) {
      throw new BadRequestException(`[create-Users] error: ${error.message}`);
    }
  }

  async findAll(): Promise<UsersResponse[]> {
    try {
      const cacheKey = 'all_users';
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const users = await this.usersRepository.findAll();

      await this.redisService.set(cacheKey, JSON.stringify(users), 3600);

      return users;
    } catch (error) {
      throw new BadRequestException(`[findAll-Users] error: ${error.message}`);
    }
  }

  async findById(id: string): Promise<UsersResponse> {
    try {
      const cacheKey = `user_${id}`;
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.redisService.set(cacheKey, JSON.stringify(user), 3600);

      return user;
    } catch (error) {
      throw new BadRequestException(`[findById-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async findByEmail(email: string): Promise<UsersResponse> {
    try {
      const cachedUser = await this.redisService.get(email);

      if (cachedUser) {
        return JSON.parse(cachedUser) as UsersResponse;
      }

      const user = await this.usersRepository.findByEmail(email);

      await this.redisService.set(email, JSON.stringify(user), 3600);

      return user;
    } catch (error) {
      throw new BadRequestException(`[FindByEmail-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async updateById(id: string, data: UpdateMeDto): Promise<UsersResponse> {
    try {
      const existsUser = await this.usersRepository.findById(id);

      if (!existsUser) {
        throw new BadRequestException('User not found');
      }

      return await this.usersRepository.updateById(id, data);
    } catch (error) {
      throw new BadRequestException(`[softDeleteById-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async roleUpdate(adminId: string, userId: string, role: RolesEnum): Promise<UsersResponse> {
    try {
      if (adminId === userId) {
        throw new BadRequestException('You can`t change your role');
      }

      return this.usersRepository.queryUpdateById(userId, { role });
    } catch (error) {
      throw new BadRequestException(`[roleUpdate-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async deleteById(id: string): Promise<void> {
    try {
      const existsUser = await this.usersRepository.findById(id);

      if (!existsUser) {
        throw new BadRequestException('User not found');
      }

      await this.usersRepository.deleteById(id);
    } catch (error) {
      throw new BadRequestException(`[softDeleteById-Users] error: ${error.message}`);
    }
  }
}
