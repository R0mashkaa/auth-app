import { UsersDto } from '../users.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateMeDto extends OmitType(UsersDto, ['password'] as const) {}
