import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserProject } from '../usersprojects/userproject.entity';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['userproject', 'task']) // no duplicate user for the same task !
@Index(['userproject', 'task'])
export class TaskAssignment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'a uuid...', description: 'User-project id' })
  @ManyToOne(() => UserProject, (userproject) => userproject.id, {
    nullable: false,
  })
  userproject: UserProject;

  @ApiProperty({
    example: 'true/false',
    description: 'User currently active on task ?',
  })
  @Column({ type: 'boolean', default: true })
  isActiveOnTask: boolean;

  @ApiProperty({
    example: 'true/false',
    description: 'Is user the task creator ?',
  })
  @Column({ type: 'boolean', default: true })
  isTaskCreator: boolean;

  @ApiProperty({ example: 'a uuid...', description: 'Task id' })
  @ManyToOne(() => Task, (task) => task.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  task: Task;
}
