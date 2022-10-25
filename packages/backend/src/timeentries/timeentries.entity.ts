import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskAssignment } from '../tasksassignments/taskassignment.entity';

@Entity()
export class TimeEntry {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2022-01-01', description: 'Day of worked time' })
  @Column({ nullable: false, type: 'timestamptz' })
  dayofwork: string;

  @ApiProperty({ example: '60', description: 'Effective worked time' })
  @Column({ nullable: false })
  workedtime: number;

  @ApiProperty({ example: 'a uuid', description: 'Task id' })
  @ManyToOne(() => TaskAssignment, (taskassignment) => taskassignment.id, {
    nullable: false,
  })
  taskassignment: TaskAssignment;
}
