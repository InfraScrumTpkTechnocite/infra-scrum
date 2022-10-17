import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsUrl } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['githuburl'])
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'project 1', description: 'Project name' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    example: 'Project for ...',
    description: 'Project description',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Sprint : reference to a project',
  })
  @ManyToOne(() => Project, (project) => project.id, {
    nullable: true,
  })
  project: Project;

  @ApiProperty({
    example: 'https://github....',
    description: 'Github repository url  (unique)',
  })
  @Column({ nullable: true })
  @IsUrl()
  githuburl: string;

  @ApiProperty({ example: 'a token...', description: 'Github token' })
  @Column({ nullable: true })
  githubtoken: string;

  @ApiProperty({
    example: 'a date',
    description: 'Foreseen start date of a project',
  })
  @Column({ nullable: false, type: 'timestamptz' })
  //@IsDateString()
  startdate: string;

  @ApiProperty({
    example: 'a date',
    description: 'Foreseen start date of a project',
  })
  @Column({ nullable: true, type: 'timestamptz', default: null })
  //@IsDateString()
  enddate: string;

  @ApiProperty({ example: 'url? blob?', description: 'User picture' })
  @Column({ nullable: true })
  picture: string;
}
