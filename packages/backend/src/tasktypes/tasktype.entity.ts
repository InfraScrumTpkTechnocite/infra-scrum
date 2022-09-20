import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['label'])
@Index(['label'])
export class TaskType {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'In progress',
    description: 'Task type label (unique)',
  })
  @Column({ nullable: false })
  label: string;
}
