import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AppService) {}

  @Post('login')
  async login(
    @Body() dto: LoginUserDto, // Recibe directamente el DTO
  ): Promise<{ access_token: string }> {
    // Llama al servicio de login
    return this.authService.login(dto);
  }
}
