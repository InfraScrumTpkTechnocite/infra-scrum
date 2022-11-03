import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, Equal } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { UserProject } from './userproject.entity';

@Injectable()
export class UsersprojectsService {
  constructor(
    @InjectRepository(UserProject)
    private usersProjectsRepository: Repository<UserProject>,
    private configService: ConfigService,
  ) {}

  async create(userproject: UserProject): Promise<UserProject> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject> => {
        return await transactionnalEntityManager.save(UserProject, userproject);
      },
    );
  }

  async update(id: string, userproject: UserProject): Promise<UpdateResult> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(
          UserProject,
          id,
          userproject,
        );
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(UserProject, id);
      },
    );
  }

  async findAll(): Promise<UserProject[]> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject[]> => {
        return await transactionnalEntityManager.find(UserProject, {
          relations: ['user', 'project'],
        });
      },
    );
  }

  async findOne(id: string): Promise<UserProject> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject> => {
        return await transactionnalEntityManager.findOneBy(UserProject, { id });
      },
    );
  }

  async findCurrentUserProjects(userid: string): Promise<UserProject[]> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject[]> => {
        return await transactionnalEntityManager.find(UserProject, {
          select: ['project'],
          relations: { project: true, user: true },
          where: { user: Equal(userid) },
          order: {
            project: { startdate: 'ASC' },
          },
        });
      },
    );
  }

  async findCurrentProjectUsers(projectid: string): Promise<UserProject[]> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject[]> => {
        return await transactionnalEntityManager.find(UserProject, {
          select: ['user'],
          relations: { project: true, user: true },
          where: { project: { id: Equal(projectid) } },
          order: {
            project: { startdate: 'ASC' },
          },
        });
      },
    );
  }

  //function to get the list of all projects (wihout duplicates => distinctOn => only once even if more than 1 user is assigned)
  // => list for superadmin only
  async findAllAssignedAtLeastOnce(): Promise<UserProject[]> {
    return await this.usersProjectsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UserProject[]> => {
        return await transactionnalEntityManager
          .createQueryBuilder(UserProject, 'userproject')
          .select('userproject')
          .addSelect('user')
          .addSelect('project')
          .innerJoin('userproject.user', 'user')
          .innerJoin('userproject.project', 'project')
          .distinctOn(['project.id', 'project.startdate'])
          .orderBy('project.startdate', 'ASC')
          .getMany();
      },
    );
  }
}
