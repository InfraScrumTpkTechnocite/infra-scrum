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
import { TimeEntry } from './timeentries.entity';
import { TimeentriesService } from './timeentries.service';

@UseFilters(new QueryFailedExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('time-entries')
@Controller('timeentries')
export class TimeentriesController {
  constructor(private timeEntriesService: TimeentriesService) {}

  @Post()
  async create(@Body() user: TimeEntry): Promise<TimeEntry> {
    return await this.timeEntriesService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: TimeEntry,
  ): Promise<UpdateResult> {
    return await this.timeEntriesService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.timeEntriesService.delete(id);
  }

  @Get()
  async findAll(): Promise<TimeEntry[]> {
    return await this.timeEntriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TimeEntry> {
    return await this.timeEntriesService.findOne(id);
  }

  @Get('/totalusersworkedtimeontask/:taskid')
  async totalWorkedtime(@Param('taskid') taskid: string): Promise<any> {
    return await this.timeEntriesService.totalUsersWorkedTimeOnTask(taskid);
  }
}
