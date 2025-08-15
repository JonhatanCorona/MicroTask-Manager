import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom, retry, throwError } from 'rxjs';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginUserDto) {
  const { email, password } = dto;

  const response = await firstValueFrom(
    this.httpService.get('http://users-service:3001/users/by-email', {
      params: { email, password }, // enviar contraseña en texto plano
    }).pipe(
      retry(2),
      catchError(err => throwError(() => err)),
    )
  );

  const user = response.data;
  if (!user) throw new UnauthorizedException('Usuario no encontrado o contraseña incorrecta');

  return user; // {id, name, email}
}


  async login(dto: LoginUserDto) {
  const user = await this.validateUser(dto);
  const payload = { sub: user.id, email: user.email, role: user.role };
  return { access_token: this.jwtService.sign(payload) };
}
}