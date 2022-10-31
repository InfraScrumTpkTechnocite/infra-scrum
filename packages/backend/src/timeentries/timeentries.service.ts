import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TimeEntry } from './timeentries.entity';

@Injectable()
export class TimeentriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: Repository<TimeEntry>,
  ) {}

  async create(timeentry: TimeEntry): Promise<TimeEntry> {
    return await this.timeEntriesRepository.save(timeentry);
  }

  async update(id: string, timeentry: TimeEntry): Promise<UpdateResult> {
    return await this.timeEntriesRepository.update(id, timeentry);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.timeEntriesRepository.delete(id);
  }

  async findAll(): Promise<TimeEntry[]> {
    return await this.timeEntriesRepository.find({
      relations: {
        taskassignment: {
          task: { tasktype: true, kanbanstatus: true },
          userproject: { user: { role: true }, project: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<TimeEntry> {
    return await this.timeEntriesRepository.findOneBy({ id });
  }

  async totalUsersWorkedTimeOnTask(taskid: string): Promise<any> {
    return await this.timeEntriesRepository
      .createQueryBuilder('timeentry')
      .select('SUM(workedtime)', 'total_minutes')
      .addSelect('task.name')
      .addSelect('user.username')
      .innerJoin('timeentry.taskassignment', 'taskassignment')
      .innerJoin('taskassignment.task', 'task')
      .innerJoin('taskassignment.userproject', 'userproject')
      .innerJoin('userproject.user', 'user')
      .where('task.id = :taskid', {
        taskid,
      })
      .groupBy('task.name')
      .addGroupBy('user.username')
      .getRawMany();
  }
}
