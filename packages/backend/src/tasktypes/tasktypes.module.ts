import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskType } from './tasktype.entity';
import { TasktypesController } from './tasktypes.controller';
import { TasktypesService } from './tasktypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskType])],
  exports: [TypeOrmModule, TasktypesService],
  controllers: [TasktypesController],
  providers: [TasktypesService]
})
export class TasktypesModule {}
