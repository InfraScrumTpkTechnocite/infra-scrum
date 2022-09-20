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
import { DeleteResult, UpdateResult } from 'typeorm';
import { TasktypesService } from './tasktypes.service';
import { TaskType } from './tasktype.entity';

@UseFilters(new QueryFailedExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('tasktypes')
@Controller('tasktypes')
export class TasktypesController {
  constructor(private tasksTypesService: TasktypesService) {}

  @Post()
  async create(@Body() user: TaskType): Promise<TaskType> {
    return await this.tasksTypesService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: TaskType,
  ): Promise<UpdateResult> {
    return await this.tasksTypesService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.tasksTypesService.delete(id);
  }

  @Get()
  async findAll(): Promise<TaskType[]> {
    return await this.tasksTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskType> {
    return await this.tasksTypesService.findOne(id);
  }

  @Get('/:label')
  async findOneByUsername(@Param('label') label: string): Promise<TaskType> {
    return await this.tasksTypesService.findOneByLabel(label);
  }
}
