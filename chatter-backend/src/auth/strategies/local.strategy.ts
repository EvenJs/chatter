import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { UsersService } from "src/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, passport: string) {
    try {
      return await this.usersService.verifyUser(email, passport);
    } catch (error) {
      throw new UnauthorizedException("Credentials are not valid.")
    }
  }
}