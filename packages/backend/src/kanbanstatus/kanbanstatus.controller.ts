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
import { KanbanStatus } from './kanbanstatus.entity';
import { KanbanstatusService } from './kanbanstatus.service';

@UseFilters(new QueryFailedExceptionFilter())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('kanbanstatus')
@Controller('kanbanstatus')
export class KanbanstatusController {
  constructor(private kanbanStatusService: KanbanstatusService) {}

  @Post()
  async create(@Body() kanbanStatus: KanbanStatus): Promise<KanbanStatus> {
    return await this.kanbanStatusService.create(kanbanStatus);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() kanbanStatus: KanbanStatus,
  ): Promise<UpdateResult> {
    return await this.kanbanStatusService.update(id, kanbanStatus);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.kanbanStatusService.delete(id);
  }

  @Get()
  async findAll(): Promise<KanbanStatus[]> {
    return await this.kanbanStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<KanbanStatus> {
    return await this.kanbanStatusService.findOne(id);
  }

  @Get(':projectid/:kanbanstatusname')
  async findOneByProjectAndName(
    @Param('projectid') projectid: string,
    @Param('kanbanstatusname') kanbanstatusname: string,
  ): Promise<KanbanStatus> {
    return await this.kanbanStatusService.findOneByProjectAndName(
      projectid,
      kanbanstatusname,
    );
  }

  @Get('of/project/:projectid')
  async findAllOfProject(
    @Param('projectid') projectid: string,
  ): Promise<KanbanStatus[]> {
    return await this.kanbanStatusService.findAllOfProject(projectid);
  }
}
