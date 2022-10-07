import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Project } from '../projects/project.entity';

@Unique(['user', 'project'])
@Index(['user', 'project'])
@Entity()
export class UserProject {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'a user uuid...', description: 'User id' })
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @ApiProperty({ example: 'a project uuid...', description: 'Project id' })
  @ManyToOne(() => Project, (project) => project.id, {
    nullable: false,
  })
  project: Project;

  @ApiProperty({
    example: 'true/false',
    description: 'Is user project admin ?',
  })
  @Column({ nullable: false, default: false })
  isprojectadmin: boolean;
}
