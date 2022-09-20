import { Module } from '@nestjs/common';
import { TasksAssignmentsService } from './tasksassignments.service';
import { TasksAssignmentsController } from './tasksassignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from './taskassignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignment])],
  exports: [TypeOrmModule, TasksAssignmentsService],
  providers: [TasksAssignmentsService],
  controllers: [TasksAssignmentsController]
})
export class TasksassignmentsModule {}
