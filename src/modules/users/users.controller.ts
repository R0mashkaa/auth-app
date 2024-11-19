import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiJwtPayload, GetUser, LoggerApi } from '@app/common';
import { UpdateMeDto, UsersResponse } from './dto';
import { UsersService } from './users.service';
import { Roles } from '@app/common/decorators/roles.decorator';
import { RolesEnum } from '@app/modules/users/enums';

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

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({
    summary: '[UpdateUserRoleById]',
    description: '[Admin] Find user by id and update role',
  })
  @ApiQuery({ name: 'role', enum: RolesEnum })
  @ApiResponse({ type: UsersResponse })
  @HttpCode(HttpStatus.OK)
  async updateById(
    @GetUser() user: ApiJwtPayload,
    @Param('id') userId: string,
    @Query('role') role: RolesEnum,
  ): Promise<UsersResponse> {
    return await this.usersService.roleUpdate(user.id, userId, role);
  }

  @Patch('updateMe/:id')
  @ApiOperation({
    summary: '[UpdateMe]',
    description: 'Update authorised user',
  })
  @ApiResponse({ type: UsersResponse })
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @GetUser() user: ApiJwtPayload,
    @Body() data: UpdateMeDto,
  ): Promise<UsersResponse> {
    return await this.usersService.updateById(user.id, data);
  }

  @Delete(':id')
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
