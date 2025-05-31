import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION')
    )

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload)
    response.cookie('Authentication', token, { httpOnly: true, expires })
  }

  verifyWs(request: Request): TokenPayload | null {
    try {
      const cookies = request.headers.cookie?.split(';').map((cookie) => cookie.trim());

      const authCookie = cookies?.find((cookie) =>
        cookie.includes('Authentication=')
      );

      if (!authCookie) return null;

      const token = authCookie.split('Authentication=')[1];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token);

      return payload
    } catch (error) {

      return null;
    }
  }

  logout(response: Response) {
    response.cookie('Authentication', "", {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
