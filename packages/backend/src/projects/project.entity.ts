import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUrl } from 'class-validator';
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
  @IsOptional()
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
  @IsOptional()
  githuburl: string;

  @ApiProperty({ example: 'a token...', description: 'Github token' })
  @Column({ nullable: true })
  @IsOptional()
  githubtoken: string;

  @ApiProperty({
    example: 'a date',
    description: 'Foreseen start date of a project',
  })
  @Column({ nullable: false, type: 'timestamptz' })
  @IsDateString()
  startdate: string;

  @ApiProperty({
    example: 'a date',
    description: 'Foreseen start date of a project',
  })
  @Column({ nullable: true, type: 'timestamptz', default: null })
  @IsDateString()
  @IsOptional()
  enddate: string;

  @ApiProperty({ example: 'base64 encoded', description: 'User picture' })
  @Column({ nullable: true })
  @IsOptional()
  picture: string;
}
