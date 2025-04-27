// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Define una interfaz para el usuario autenticado
interface JwtUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

// Define una interfaz para la request que incluye el usuario autenticado
interface RequestWithUser extends Request {
  user: JwtUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.get<boolean>(
      'isAdmin',
      context.getHandler(),
    );
    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return user && user.isAdmin === true;
  }
}
