import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No se encontró el token');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = {
        sub: decoded.sub as string,
        email: decoded.email as string,
      };

      (request as any).token = token;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
