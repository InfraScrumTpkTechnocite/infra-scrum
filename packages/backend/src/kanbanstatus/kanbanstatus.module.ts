import { Module } from '@nestjs/common';
import { KanbanstatusService } from './kanbanstatus.service';
import { KanbanstatusController } from './kanbanstatus.controller';
import { KanbanStatus } from './kanbanstatus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanStatus])],
  exports: [TypeOrmModule, KanbanstatusService],
  providers: [KanbanstatusService],
  controllers: [KanbanstatusController],
})
export class KanbanstatusModule {}
