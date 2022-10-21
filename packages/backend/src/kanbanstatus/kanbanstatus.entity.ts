import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../projects/project.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsHexColor } from 'class-validator';

@Entity()
@Index(['name', 'project'])
export class KanbanStatus {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'To do', description: 'Kanban status name (unique)' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: '11', description: 'Kanban status order number' })
  @Column({ type: 'integer', nullable: false, default: -1 })
  order: number;

  @ApiProperty({ example: 'blue, #1AB2C3', description: 'Kanban color' })
  @Column({ nullable: false, default: '#1F71A5' })
  @IsHexColor()
  color: string;

  @ApiProperty({ example: 'a uuid...', description: 'Project/Spring id' })
  @ManyToOne(() => Project, (project) => project.id, {
    nullable: false,
  })
  project: Project;
}
