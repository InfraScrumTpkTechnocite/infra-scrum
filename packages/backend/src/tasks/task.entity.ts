import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '../tasktypes/tasktype.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { KanbanStatus } from '../kanbanstatus/kanbanstatus.entity';
import { IsHexColor, IsOptional } from 'class-validator';
import { Project } from '../projects/project.entity';

@Entity()
@Unique(['task', 'kanbanstatus']) //no duplicate task in a kanban !
@Index(['task', 'kanbanstatus'])
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'task 1', description: 'Task name' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'a uuid', description: 'Kanban id' })
  @ManyToOne(() => KanbanStatus, (kanbanstatus) => kanbanstatus.id, {
    nullable: false,
  })
  kanbanstatus: KanbanStatus;

  @ApiProperty({ example: 'task id', description: 'Task id (subtask)' })
  @IsOptional()
  @ManyToOne(() => Task, (task) => task.id, { nullable: true })
  task: Task;

  @ApiProperty({ example: 'task 1 is...', description: 'Task description' })
  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2022-09-01',
    description: 'Foreseen start date of the task',
  })
  @Column({ type: 'timestamptz', nullable: false })
  startdate: Date;

  @ApiProperty({ example: 'time', description: 'Estimated task time' })
  @Column({ nullable: false })
  estimatedtime: number;

  @ApiProperty({ example: 'File', description: 'File URL ?' })
  @Column({ nullable: true, default: 'no file' })
  @IsOptional()
  file: string;

  @ApiProperty({ example: 'true/false', description: 'Is task done ?' })
  @Column({ nullable: false, default: false })
  done: boolean;

  @ApiProperty({ example: 'a uuid...', description: 'Task type id' })
  @ManyToOne(() => TaskType, (tasktype) => tasktype.id, { nullable: false })
  tasktype: TaskType;

  @ApiProperty({ example: 'a uuid...', description: 'Sprint id' })
  @ManyToOne(() => Project, (project) => project.id, { nullable: true })
  sprint: Project;

  @ApiProperty({ example: 'blue, #1AB2C3', description: 'Kanban color' })
  @Column({ nullable: false, default: '#1F71A5' })
  @IsHexColor()
  color: string;
}
