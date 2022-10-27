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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { readFile, readFileSync, unlink } from 'fs';
import { Project } from './projects/project.entity';

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
          if (role.name == 'superadmin') {
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

  @Post('image-upload/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000 }),
          new FileTypeValidator({
            fileType: new RegExp('(.jpeg|.JPEG|.gif|.GIF|.png|.PNG)$'),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    // console.log(file);
    // console.log(`project id : ${id}`);

    let project: Project = new Project();

    this.projectsService.findOne(id).then((result) => {
      project = result;
    });

    readFile(file.path, (err, data) => {
      if (err) throw err;

      //console.log(data.toString('base64'));

      project.picture = data.toString('base64');
      this.projectsService.update(id, project);

      unlink(file.path, (error) => {
        console.log(error);
      });
    });

    return new Observable((subscriber) => {
      subscriber.next(file);
      subscriber.complete();
    });
  }
}
