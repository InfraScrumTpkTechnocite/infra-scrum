import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TaskType } from './tasktype.entity';

@Injectable()
export class TasktypesService {
  constructor(
    @InjectRepository(TaskType)
    private tasksTypesRepository: Repository<TaskType>,
    private configService: ConfigService,
  ) {}

  async create(tasktype: TaskType): Promise<TaskType> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskType> => {
        return await transactionnalEntityManager.save(TaskType, tasktype);
      },
    );
  }

  async update(id: string, tasktype: TaskType): Promise<UpdateResult> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(TaskType, id, tasktype);
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(TaskType, id);
      },
    );
  }

  async findAll(): Promise<TaskType[]> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskType[]> => {
        return await transactionnalEntityManager.find(TaskType);
      },
    );
  }

  async findOne(id: string): Promise<TaskType> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskType> => {
        return await transactionnalEntityManager.findOneBy(TaskType, { id });
      },
    );
  }

  async findOneByLabel(label: string): Promise<TaskType> {
    return await this.tasksTypesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskType> => {
        return await transactionnalEntityManager.findOneBy(TaskType, {
          label: label,
        });
      },
    );
  }
}
