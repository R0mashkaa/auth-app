import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RolesEnum } from '@app/modules/users/enums';

export class UsersDto {
  @ApiProperty({ example: 'Jon' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  lastName: string;

  @ApiProperty({ example: RolesEnum.USER })
  @IsString()
  @IsEnum(RolesEnum)
  @Expose()
  role: string;

  @ApiProperty({ example: 'example@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Expose()
  email: string;

  @ApiPropertyOptional({ example: '12345678' })
  @MinLength(8)
  @IsString()
  @Expose()
  password: string;
}
