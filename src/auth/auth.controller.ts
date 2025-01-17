import { AuthDecorator } from './decorators/auth.decorator';
import { SignInDTO } from './dtos/signin.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './providers/auth.service';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  private logger = new Logger('UsersController');

  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @AuthDecorator(AuthType.None)
  public async signIn(@Body() signInDto: SignInDTO) {
    this.logger.verbose(`user sign in for user ${JSON.stringify(signInDto)}`);

    return await this.authService.signIn(signInDto);
  }
}
