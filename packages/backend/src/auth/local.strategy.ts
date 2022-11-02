import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
    // console.log('LocalStrategy - constructor');
  }

  async validate(username: string, password: string): Promise<any> {
    // console.log(
    //   `local.strategy - validate - username=${username}/password=${password}`,
    // );
    const user = await this.authService.validateUser(username, password);
    // console.log('local.strategy - validate - user=' + JSON.stringify(user));
    if (!user) {
      console.log('local.strategy - validate - ko');
      throw new UnauthorizedException();
    }
    return user;
  }
}
