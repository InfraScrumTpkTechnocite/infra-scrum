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
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(new QueryFailedExceptionFilter())
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  async create(@Body() task: Task): Promise<Task> {
    return await this.taskService.create(task);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() task: Task,
  ): Promise<UpdateResult> {
    return await this.taskService.update(id, task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.taskService.delete(id);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.taskService.findOne(id);
  }

  @Get('/name/:name')
  async findOneByName(@Param('name') name: string): Promise<Task> {
    return await this.taskService.findOneByName(name);
  }

  @Get('of/kanbanstatus/:kanbanstatusid')
  async findAllOfKanbanstatus(
    @Param('kanbanstatusid') kanbanstatusid: string,
  ): Promise<Task[]> {
    return await this.taskService.findAllOfKanbanstatusid(kanbanstatusid);
  }
}
