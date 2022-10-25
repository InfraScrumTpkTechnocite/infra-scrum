import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      where: { user: Equal(userid) },
      order: {
        project: { startdate: 'ASC' },
      },
    });
  }

  async findCurrentProjectUsers(projectid: string): Promise<UserProject[]> {
    return await this.usersProjectsRepository.find({
      select: ['user'],
      relations: { project: true, user: true },
      where: { project: { id: Equal(projectid), enddate: IsNull() } },
      order: {
        project: { startdate: 'ASC' },
      },
    });
  }
}
