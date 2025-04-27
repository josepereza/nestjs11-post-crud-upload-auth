// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RequireAdmin = () => SetMetadata('isAdmin', true);
