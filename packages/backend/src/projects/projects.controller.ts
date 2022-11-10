import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { KanbanstatusService } from '../kanbanstatus/kanbanstatus.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { readFile, unlink } from 'fs';
import { Observable } from 'rxjs';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(new QueryFailedExceptionFilter())
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private kanbanStatusService: KanbanstatusService,
  ) {}

  @Post()
  async create(@Body() project: Project): Promise<Project> {
    const defaultKanbanstatus: any[] = [
      {
        name: 'Backlog',
        kanbancolor: '#1F71A5',
        project: '',
        order: 0,
      },
      {
        name: 'In progress',
        kanbancolor: '#1F71A5',
        project: '',
        order: 1,
      },
      {
        name: 'Urgent',
        kanbancolor: '#1F71A5',
        project: '',
        order: 2,
      },
      {
        name: 'Done',
        kanbancolor: '#1F71A5',
        project: '',
        order: 3,
      },
    ];
    const new_project: Project = await this.projectsService.create(project);

    //if not a sprint, create 4 default kanbans (Backlog, In progress, Urgent and Done)
    if (!project.project) {
      defaultKanbanstatus.forEach((kanbanstatus) => {
        kanbanstatus.project = new_project.id;
        this.kanbanStatusService.create(kanbanstatus);
        // .catch((err) => {
        //   throw err;
        // });
      });
    }
    return new_project;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() project: Project,
  ): Promise<UpdateResult> {
    return await this.projectsService.update(id, project);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.projectsService.delete(id);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectsService.findOne(id);
  }

  @Get('/name/:name')
  async findOneByName(@Param('name') name: string): Promise<Project> {
    return await this.projectsService.findOneByName(name);
  }

  @Get('/:id/sprintsonly/')
  async findSprintsOnly(@Param('id') id: string): Promise<Project[]> {
    return this.projectsService.findSprintsOnly(id);
  }

  @Get('/projects/only/')
  async findProjectsOnly(): Promise<Project[]> {
    return this.projectsService.findProjectsOnly();
  }

  @Post('image-upload/:projectid')
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
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({
            fileType: new RegExp('(.jpeg|.JPEG|.gif|.GIF|.png|.PNG)$'),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('projectid') projectid: string,
  ) {
    // console.log(file);
    // console.log(`project id : ${projectid}`);

    let project: Project = new Project();

    this.projectsService.findOne(projectid).then((result) => {
      project = result;
    });

    readFile(file.path, (err, data) => {
      if (err) throw err;

      //console.log(data.toString('base64'));

      project.picture = data.toString('base64');
      this.projectsService.update(projectid, project);

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
