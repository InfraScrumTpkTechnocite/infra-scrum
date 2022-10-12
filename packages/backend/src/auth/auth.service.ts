import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log(
      `auth.service - validateUser username=${username}, pass=${pass}, user.password=${user.password}`,
    );
    console.log(`comparaison passwords=${await compare(pass, user.password)}`);
    //console.log(`User ${user.username} active : ${user.active}`);
    if (user && (await compare(pass, user.password)) /*&& user.active*/) {
      console.log(
        `user ${user.username} exists, is active and passwords comparaison is ok.`,
      );
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    // console.log('auth.service - login');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
