import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notEqual } from 'assert';
import { isDateString, isNotEmpty } from 'class-validator';
import { Repository, UpdateResult, DeleteResult, Equal, IsNull } from 'typeorm';
import { UserProject } from './userproject.entity';

@Injectable()
export class UsersprojectsService {
  constructor(
    @InjectRepository(UserProject)
    private usersProjectsRepository: Repository<UserProject>,
  ) { }

  async create(userproject: UserProject): Promise<UserProject> {
    return await this.usersProjectsRepository.save(userproject);
  }

  async update(id: string, userproject: UserProject): Promise<UpdateResult> {
    return await this.usersProjectsRepository.update(id, userproject);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersProjectsRepository.delete(id);
  }

  async findAll(): Promise<UserProject[]> {
    return await this.usersProjectsRepository.find({
      relations: ['user', 'project'],
    });
  }

  async findOne(id: string): Promise<UserProject> {
    return await this.usersProjectsRepository.findOneBy({ id });
  }

  async findCurrentUserProjects(userid: string): Promise<UserProject[]> {
    return await this.usersProjectsRepository.find({
      select: ['project'],
      relations: { project: true },
      where: { user: Equal(userid), project: { enddate: IsNull() } },
      order: {
        project: { startdate: 'ASC' },
      },
    });
  }
}
