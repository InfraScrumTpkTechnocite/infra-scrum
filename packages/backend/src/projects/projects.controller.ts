import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KanbanstatusService } from '../kanbanstatus/kanbanstatus.service';
import { defaultKanbanstatus } from '../kanbanstatus/default-kanbanstatus';
import { KanbanStatus } from 'src/kanbanstatus/kanbanstatus.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(new QueryFailedExceptionFilter())
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
    private kanbanStatusService: KanbanstatusService,
  ) {}

  @Post()
  async create(@Body() project: Project): Promise<Project> {
    const new_project: Project = await this.projectService.create(project);

    defaultKanbanstatus.forEach((kanbanstatus) => {
      kanbanstatus.project = new_project.id;
      this.kanbanStatusService.create(kanbanstatus)
      // .catch((err) => {
      //   throw err;
      // });
    });

    return new_project;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() project: Project,
  ): Promise<UpdateResult> {
    return await this.projectService.update(id, project);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.projectService.delete(id);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectService.findOne(id);
  }

  @Get('/name/:name')
  async findOneByName(@Param('name') name: string): Promise<Project> {
    return await this.projectService.findOneByName(name);
  }

  @Get('/:id/sprints/')
  async findSprints(@Param('id') id: string): Promise<Project[]> {
    return this.projectService.findSprints(id);
  }

  @Get('/:id/kanbanstatus/')
  async findKanbanStatus(@Param('id') id: string): Promise<KanbanStatus[]> {
    return this.kanbanStatusService.findAllByProject(id);
  }
}
