import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }
}
