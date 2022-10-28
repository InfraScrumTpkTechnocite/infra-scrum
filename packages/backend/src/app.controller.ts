import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AppService } from './app.service';
//import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { seederUser, seederRoles } from './seeder/seeder';
import { ProjectsService } from './projects/projects.service';
import { RolesService } from './roles/roles.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private rolesService: RolesService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: User })
  @Post('auth/login')
  async login(@Request() req) {
    //return req.user;
    console.log('app.controller - login');
    return this.authService.login(req.user);
  }

  //@UseGuards(LocalAuthGuard)
  //@ApiBody({ type: User })
  // @Get('auth/confirm/:username/:token')
  // async confirm(@Param('username') username: string, @Param('token') token: string) {
  //   //return req.user;
  //   console.log(`app.controller - confirm - username=${username}, token=${token}`);
  //   //return this.authService.login(req.user);
  //   let user: User = await this.usersService.findOneByUsername(username);
  //   console.log(`app.controller - user=${user.username}, token=${user.token}`);
  //   delete user.password;//to avoid password modification
  //   if (user && user.token == token) {
  //     user.active = true;
  //     user.token = null;
  //   }
  //   return await this.usersService.update(user.id, user);
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/seed')
  async seed() {
    seederRoles.forEach((role) => {
      this.rolesService
        .create(role)
        .then((role) => {
          console.log(`Role ${role.name} created`);
          if (role.name == this.configService.get<string>('SUPERADMIN_ROLE')) {
            seederUser.role = role.id;
            this.usersService
              .create(seederUser)
              .then((seederUser) =>
                console.log(`User ${seederUser.username} created`),
              )
              .catch((error) => console.log(error.driverError.detail));
          }
        })
        .catch((error) => console.log(error.driverError.detail));
    });
  }
}
