// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  username: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'codigosecreto',
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  }
}
