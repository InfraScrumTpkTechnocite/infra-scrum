import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../tasks/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeEntry {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'time', description: 'Effective worked time' })
  @Column({ nullable: false })
  workedtime: number;

  @ApiProperty({ example: 'a uuid', description: 'Task id' })
  @ManyToOne(() => Task, (task) => task.id, { nullable: false })
  task: string;
}
