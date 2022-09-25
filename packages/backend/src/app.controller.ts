import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
//import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { seederUsers, seederProjects, seederRoles } from './seeder/seeder';
import { ProjectsService } from './projects/projects.service';
import { RolesService } from './roles/roles.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private rolesService: RolesService,
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
        .then((role) => console.log(`User ${role.name} created`))
        .catch((error) => console.log(error.driverError.detail));
    });

    seederProjects.forEach((project) => {
      this.projectsService
        .create(project)
        .then((project) =>
          console.log(`Project ${project.projectname} created`),
        )
        .catch((error) => console.log(error.driverError.detail));
    });

    this.rolesService
      .findOneByName('superadmin')
      .then((role) => {
        seederUsers[0].role = role.id;
        console.log(`superadmin role id : ${role.id}`);
      })
      .catch((error) => console.log(error.driverError.detail));
    console.log(`seederUsers[0] role id : ${seederUsers[0].role}`);
    
    seederUsers.forEach((user) => {
      this.usersService
        .create(user)
        .then((user) => console.log(`User ${user.username} created`))
        .catch((error) => console.log(error.driverError.detail));
    });
  }
}
