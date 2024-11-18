import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerApi } from 'src/common';
import { UsersResponse } from './dto';
import { UsersService } from './users.service';

@LoggerApi()
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: '[GetAllUsers]',
    description: 'Get all users',
  })
  @ApiResponse({ type: UsersResponse, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<UsersResponse[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '[GetUserById]',
    description: 'Get user by id',
  })
  @ApiResponse({ type: UsersResponse })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<UsersResponse> {
    return await this.usersService.findById(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: '[DeleteUserById]',
    description: 'Delete user by id',
  })
  @ApiResponse({ type: UsersResponse })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: string): Promise<void> {
    return await this.usersService.deleteById(id);
  }
}
