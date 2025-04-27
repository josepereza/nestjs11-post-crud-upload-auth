// src/auth/auth.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
type UserWithoutPassword = {
  user_ID: number;
  username: string;
  isAdmin: boolean;
  // otras propiedades excepto password y métodos
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await this.usersService.findByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        console.log(password);
        return result;
      }
      return null;
    } catch (error) {
      // Manejo tipado de errores
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error validating user: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown error validating user');
    }
  }

  login(user: Omit<User, 'password'>) {
    console.log(user);
    const payload = {
      username: user.username,
      sub: user.user_ID,
      isAdmin: user.isAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_ID,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };
  }
}
