import { ApiProperty } from '@nestjs/swagger';
import {
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

  @ApiProperty({ example: 'a uuid...', description: 'Task id' })
  @ManyToOne(() => Task, (task) => task.id, { nullable: false })
  task: Task;
}
