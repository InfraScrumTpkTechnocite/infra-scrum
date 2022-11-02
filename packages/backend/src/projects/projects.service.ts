import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, IsNull, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private configService: ConfigService,
  ) {}

  async create(project: Project): Promise<Project> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project> => {
        return await transactionnalEntityManager.save(Project, project);
      },
    );
  }

  async update(id: string, project: Project): Promise<UpdateResult> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(Project, id, project);
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(Project, id);
      },
    );
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project[]> => {
        return await transactionnalEntityManager.find(Project, {
          relations: ['project'],
        });
      },
    );
  }

  async findOne(id: string): Promise<Project> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project> => {
        return await transactionnalEntityManager.findOne(Project, {
          select: ['project'],
          relations: { project: true },
          where: { id: Equal(id) },
        });
      },
    );
  }

  async findOneByName(name: string): Promise<Project> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project> => {
        return await transactionnalEntityManager.findOneBy(Project, {
          name: name,
        });
      },
    );
  }

  async findSprintsOnly(projectid: string): Promise<Project[]> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project[]> => {
        return await transactionnalEntityManager
          .createQueryBuilder(Project, 'project')
          .where('project.project = :projectid', { projectid })
          .orderBy('project.startdate', 'ASC')
          .getMany();
      },
    );
  }

  async findProjectsOnly(): Promise<Project[]> {
    return await this.projectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Project[]> => {
        return await transactionnalEntityManager.find(Project, {
          select: ['project'],
          where: { project: IsNull() },
          order: { startdate: 'ASC' },
        });
      },
    );
  }
}
