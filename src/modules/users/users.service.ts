import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerServiceDecorator } from 'src/common';
import { CreateUserDto, UsersResponse } from './dto';
import { UsersRepository } from '../repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  @LoggerServiceDecorator()
  async create(data: CreateUserDto): Promise<UsersResponse> {
    try {
      return await this.usersRepository.create(data);
    } catch (error) {
      throw new BadRequestException(`[create-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async findAll(): Promise<any[]> {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new BadRequestException(`[findAll-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async findById(id: string): Promise<UsersResponse> {
    try {
      return await this.usersRepository.findById(id);
    } catch (error) {
      throw new BadRequestException(`[findById-Users] error: ${error.message}`);
    }
  }

  @LoggerServiceDecorator()
  async findByEmail(email: string): Promise<UsersResponse> {
    try {
      return await this.usersRepository.findByEmail(email);
    } catch (error) {
      throw new BadRequestException(`[FindByEmail-Users] error: ${error.message}`);
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
