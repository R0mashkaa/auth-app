import { UsersDto } from '../users.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateUserDto extends OmitType(UsersDto, ['role'] as const) {}
