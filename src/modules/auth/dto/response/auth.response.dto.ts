import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { UsersDto } from 'src/modules/users';

export class AuthResponse extends UsersDto {
  @ApiProperty({
    example:
      'aeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwZWQ4NTM1LTQxZjMtNDEyMy05MWM1LTQ5OWY1MzE3M2QyMCIsImVtYWlsIjoic2VyZ2l5ZGV2bWFzdGVyQGdtYWlsLmNvbSIsImlhdCI6MTcyNDQxNjAyMiwiZXhwIjoxNzI0NDM3NjIyfQ.mpLrrAjlymqIeALIjDIK3BVt3qCk4VE68hFS5u3v8gU',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  access_token: string;
}
