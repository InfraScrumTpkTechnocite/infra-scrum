import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TaskAssignment } from './taskassignment.entity';

@Injectable()
export class TasksAssignmentsService {
  constructor(
    @InjectRepository(TaskAssignment)
    private tasksAssignmentsRepository: Repository<TaskAssignment>,
    private configService: ConfigService,
  ) {}

  async create(taskassignment: TaskAssignment): Promise<TaskAssignment> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskAssignment> => {
        return await transactionnalEntityManager.save(
          TaskAssignment,
          taskassignment,
        );
      },
    );
  }

  async update(
    id: string,
    taskassignment: TaskAssignment,
  ): Promise<UpdateResult> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(
          TaskAssignment,
          id,
          taskassignment,
        );
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(TaskAssignment, id);
      },
    );
  }

  async findAll(): Promise<TaskAssignment[]> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskAssignment[]> => {
        return await transactionnalEntityManager.find(TaskAssignment, {
          relations: ['userproject', 'task'],
        });
      },
    );
  }

  async findOne(id: string): Promise<TaskAssignment> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskAssignment> => {
        return await transactionnalEntityManager.findOneBy(TaskAssignment, {
          id,
        });
      },
    );
  }

  async findAllUsersOfTask(taskid: string): Promise<TaskAssignment[]> {
    return await this.tasksAssignmentsRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TaskAssignment[]> => {
        return await transactionnalEntityManager.find(TaskAssignment, {
          select: ['userproject', 'task'],
          relations: {
            userproject: { user: { role: true } },
            task: true,
          },
          where: { task: { id: Equal(taskid) } },
        });
      },
    );
  }
}
