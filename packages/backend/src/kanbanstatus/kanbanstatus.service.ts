import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { KanbanStatus } from './kanbanstatus.entity';

@Injectable()
export class KanbanstatusService {
  constructor(
    @InjectRepository(KanbanStatus)
    private kanbanStatusRepository: Repository<KanbanStatus>,
    private configService: ConfigService,
  ) {}

  async create(kanbanStatus: KanbanStatus): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<KanbanStatus> => {
        return await transactionnalEntityManager.save(
          KanbanStatus,
          kanbanStatus,
        );
      },
    );
  }

  async update(id: string, kanbanStatus: KanbanStatus): Promise<UpdateResult> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        // console.log(
        //   this.configService.get<IsolationLevel>('TYPEORM_TRANSACTION_ISOLATION_LEVEL'),
        // );
        return await transactionnalEntityManager.update(
          KanbanStatus,
          id,
          kanbanStatus,
        );
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(KanbanStatus, id);
      },
    );
  }

  async findAll(): Promise<KanbanStatus[]> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<KanbanStatus[]> => {
        return await transactionnalEntityManager.find(KanbanStatus, {
          relations: ['project'],
        });
      },
    );
  }

  async findOne(id: string): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<KanbanStatus> => {
        return await transactionnalEntityManager.findOneBy(KanbanStatus, {
          id,
        });
      },
    );
  }

  async findOneByProjectAndName(
    projectid: string,
    name: string,
  ): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<KanbanStatus> => {
        return await transactionnalEntityManager.findOne(KanbanStatus, {
          where: { name: Equal(name), project: Equal(projectid) },
        });
      },
    );
  }

  async findAllOfProject(projectid: string): Promise<KanbanStatus[]> {
    return await this.kanbanStatusRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<KanbanStatus[]> => {
        return await transactionnalEntityManager.find(KanbanStatus, {
          where: { project: Equal(projectid) },
          order: { order: 'ASC' },
        });
      },
    );
  }
}
