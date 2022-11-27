import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private configService: ConfigService,
  ) {}

  async create(project: Task): Promise<Task> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Task> => {
        return await transactionnalEntityManager.save(Task, project);
      },
    );
  }

  async update(id: string, project: Task): Promise<UpdateResult> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(Task, id, project);
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(Task, id);
      },
    );
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Task[]> => {
        return await transactionnalEntityManager.find(Task, {
          relations: ['kanbanstatus', 'task', 'tasktype'],
        });
      },
    );
  }

  async findOne(id: string): Promise<Task> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Task> => {
        return await transactionnalEntityManager.findOneBy(Task, { id });
      },
    );
  }

  async findOneByName(name: string): Promise<Task> {
    //console.log("ProjectsService - findOneByProjectname");
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Task> => {
        return await transactionnalEntityManager.findOneBy(Task, {
          name: name,
        });
      },
    );
  }

  async findAllOfKanbanstatusid(kanbanstatusid: string): Promise<Task[]> {
    return await this.tasksRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Task[]> => {
        return await transactionnalEntityManager.find(Task, {
          select: ['kanbanstatus'],
          relations: { kanbanstatus: true, tasktype: true, sprint: true },
          where: { kanbanstatus: Equal(kanbanstatusid) },
          order: { startdate: 'ASC' },
        });
      },
    );
  }
}
