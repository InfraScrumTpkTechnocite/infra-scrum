import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TimeEntry } from './timeentries.entity';

@Injectable()
export class TimeentriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: Repository<TimeEntry>,
    private configService: ConfigService,
  ) {}

  async create(timeentry: TimeEntry): Promise<TimeEntry> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TimeEntry> => {
        return await transactionnalEntityManager.save(TimeEntry, timeentry);
      },
    );
  }

  async update(id: string, timeentry: TimeEntry): Promise<UpdateResult> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(
          TimeEntry,
          id,
          timeentry,
        );
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(TimeEntry, id);
      },
    );
  }

  async findAll(): Promise<TimeEntry[]> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TimeEntry[]> => {
        return await transactionnalEntityManager.find(TimeEntry, {
          relations: {
            taskassignment: {
              task: { tasktype: true, kanbanstatus: true },
              userproject: { user: { role: true }, project: true },
            },
          },
        });
      },
    );
  }

  async findOne(id: string): Promise<TimeEntry> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TimeEntry> => {
        return await transactionnalEntityManager.findOneBy(TimeEntry, { id });
      },
    );
  }

  //total (en minutes), par user, du temps effectivement travaillé sur une tâche
  async totalUsersWorkedTimeOnTask(taskid: string): Promise<any> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<any> => {
        return await transactionnalEntityManager
          .createQueryBuilder(TimeEntry, 'timeentry')
          //.setLock('dirty_read')
          .select('SUM(workedtime)', 'total_minutes')
          .addSelect('task')
          .addSelect('user')
          .addSelect('role')
          .addSelect('tasktype')
          .innerJoin('timeentry.taskassignment', 'taskassignment')
          .innerJoin('taskassignment.task', 'task')
          .innerJoin('taskassignment.userproject', 'userproject')
          .innerJoin('task.tasktype', 'tasktype')
          .innerJoin('userproject.user', 'user')
          .innerJoin('user.role', 'role')
          .where('task.id = :taskid', {
            taskid,
          })
          .groupBy('task.id')
          .addGroupBy('user.id')
          .addGroupBy('role.id')
          .addGroupBy('tasktype.id')
          .getRawMany();
      },
    );
  }

  //temps total (en minutes) effectivement travaillé sur une tâche
  async totalWorkedTimeOnTask(taskid: string): Promise<any> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<any> => {
        return await transactionnalEntityManager
          .createQueryBuilder(TimeEntry, 'timeentry')
          //.setLock('dirty_read')
          .select('SUM(workedtime)', 'total_minutes')
          .addSelect('task')
          .innerJoin('timeentry.taskassignment', 'taskassignment')
          .innerJoin('taskassignment.task', 'task')
          .where('task.id = :taskid', {
            taskid,
          })
          .groupBy('task.id')
          .getRawMany();
      },
    );
  }

  //tous les time entries d'une tâche
  async timeEntries(taskid: string): Promise<TimeEntry[]> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TimeEntry[]> => {
        return await transactionnalEntityManager.find(TimeEntry, {
          relations: {
            taskassignment: {
              task: true,
            },
          },
          where: { taskassignment: { task: Equal(taskid) } },
          order: { dayofwork: 'ASC' },
        });
      },
    );
  }

  //tous les time entries d'1 task assignment
  async taskAssignmentTimeEntries(
    taskassignmentid: string,
  ): Promise<TimeEntry[]> {
    return await this.timeEntriesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<TimeEntry[]> => {
        return await transactionnalEntityManager.find(TimeEntry, {
          relations: {
            taskassignment: {
              task: true,
            },
          },
          where: { taskassignment: Equal(taskassignmentid) },
          order: { dayofwork: 'ASC' },
        });
      },
    );
  }
}
