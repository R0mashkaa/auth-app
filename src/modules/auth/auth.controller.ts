import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiJwtPayload, GetUser, LoggerApi, Public } from 'src/common';
import { AuthService } from './auth.service';
import { AuthResponse, SignInDto, SignUpDto } from './dto';
import { UsersResponse } from '@app/modules';

@Controller('auth')
@ApiTags('authentication')
@LoggerApi()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signIn')
  @ApiOperation({ summary: '[SignIn]', description: 'Sign in user' })
  @ApiResponse({ type: AuthResponse, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }

  @Public()
  @Post('signUp')
  @ApiOperation({ summary: '[SignUp]', description: 'Sing up user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: AuthResponse })
  async signUp(@Body() data: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  @ApiBearerAuth()
  @Get('verify')
  @ApiOperation({ summary: '[VerifyUser]', description: 'Verify user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: AuthResponse })
  async verify(@GetUser() user: ApiJwtPayload): Promise<UsersResponse> {
    return await this.authService.verify(user.id);
  }
}
