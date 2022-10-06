import { Module } from '@nestjs/common';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KanbanstatusService } from '../kanbanstatus/kanbanstatus.service';
import { KanbanStatus } from '../kanbanstatus/kanbanstatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([KanbanStatus]),
  ],
  exports: [TypeOrmModule, ProjectsService],
  providers: [ProjectsService, KanbanstatusService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
