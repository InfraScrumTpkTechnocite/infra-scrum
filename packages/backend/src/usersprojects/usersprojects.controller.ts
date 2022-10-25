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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserProject } from './userproject.entity';
import { UsersprojectsService } from './usersprojects.service';

@UseFilters(new QueryFailedExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('users-projects')
@Controller('usersprojects')
export class UsersprojectsController {
  constructor(private usersProjectsService: UsersprojectsService) { }

  @Post()
  async create(@Body() userproject: UserProject): Promise<UserProject> {
    return await this.usersProjectsService.create(userproject);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userproject: UserProject,
  ): Promise<UpdateResult> {
    return await this.usersProjectsService.update(id, userproject);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersProjectsService.delete(id);
  }

  @Get()
  async findAll(): Promise<UserProject[]> {
    return await this.usersProjectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserProject> {
    return await this.usersProjectsService.findOne(id);
  }

  @Get('/currentuserprojects/:userid')
  async findCurrentUserProjects(
    @Param('userid') userid: string,
  ): Promise<UserProject[]> {
    return await this.usersProjectsService.findCurrentUserProjects(userid);
  }

  @Get('/currentprojectusers/:projectid')
  async findCurrentProjectUsers(
    @Param('projectid') projectid: string,
  ): Promise<UserProject[]> {
    return await this.usersProjectsService.findCurrentProjectUsers(projectid);
  }
}
