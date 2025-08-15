import { Request } from 'express';

/**
 * Extrae el token Bearer del header Authorization
 * @param request Express Request
 * @returns token como string
 * @throws UnauthorizedException si no existe o está mal formado
    */
export function getBearerToken(request?: Request): string {
  if (!request) return ''; // Request no definido
  const authHeader = request.headers['authorization'] || request.headers['Authorization'];
  if (!authHeader) return ''; // Header no presente
  const token = (Array.isArray(authHeader) ? authHeader[0] : authHeader).split(' ')[1];
  return token || '';
}