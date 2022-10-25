import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(project: Project): Promise<Project> {
    return await this.projectsRepository.save(project);
  }

  async update(id: string, project: Project): Promise<UpdateResult> {
    return await this.projectsRepository.update(id, project);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.projectsRepository.delete(id);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find({ relations: ['project'] });
  }

  async findOne(id: string): Promise<Project> {
    return await this.projectsRepository.findOne({
      select: ['project'],
      relations: { project: true },
      where: { id: Equal(id) },
    });
  }

  async findOneByName(name: string): Promise<Project> {
    return await this.projectsRepository.findOneBy({ name: name });
  }

  async findSprints(projectid: string): Promise<Project[]> {
    return await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.project = :projectid', { projectid })
      .orderBy('project.startdate', 'ASC')
      .getMany();
  }
}
