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
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { TaskAssignment } from './taskassignment.entity';
import { TasksAssignmentsService } from './tasksassignments.service';

@UseFilters(new QueryFailedExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('tasks-assignments')
@Controller('tasksassignments')
export class TasksAssignmentsController {
  constructor(private taskAssignmentService: TasksAssignmentsService) {}

  @Post()
  async create(@Body() user: TaskAssignment): Promise<TaskAssignment> {
    return await this.taskAssignmentService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() taskAssignment: TaskAssignment,
  ): Promise<UpdateResult> {
    return await this.taskAssignmentService.update(id, taskAssignment);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.taskAssignmentService.delete(id);
  }

  @Get()
  async findAll(): Promise<TaskAssignment[]> {
    return await this.taskAssignmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskAssignment> {
    return await this.taskAssignmentService.findOne(id);
  }

  @Get('taskusers/:taskid')
  async findAllUsersOfTask(
    @Param('taskid') taskid: string,
  ): Promise<TaskAssignment[]> {
    return await this.taskAssignmentService.findAllUsersOfTask(taskid);
  }
}
