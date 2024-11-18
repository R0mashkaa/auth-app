import { UsersDto } from '../users.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UsersResponse extends UsersDto {
  @ApiProperty({ example: 'cf23d4f6-7e3b-4209-b275-93133e57d5de' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;
}
