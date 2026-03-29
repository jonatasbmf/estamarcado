import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { AuthService } from '../auth.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() _loginDto: LoginDto,
  ): Promise<BaseResult<AuthResponseDto>> {
    const result = await this.authService.login(req.user);
    return new BaseResult<AuthResponseDto>().ok(result);
  }
}
