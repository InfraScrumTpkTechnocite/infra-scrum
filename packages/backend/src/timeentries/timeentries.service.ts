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
    return await this.timeEntriesRepository.find({ relations: ['task'] });
  }

  async findOne(id: string): Promise<TimeEntry> {
    return await this.timeEntriesRepository.findOneBy({ id });
  }

  async totalWorkedTimeOfTask(taskid: string): Promise<number> {
    return await this.timeEntriesRepository
      .createQueryBuilder('timeentry')
      .select('SUM(workedtime)', 'total_minutes')
      .addSelect('task.name')
      .addSelect('kanbanstatus.name')
      .addSelect('project.name')
      .innerJoin('timeentry.task', 'task')
      .innerJoin('task.kanbanstatus', 'kanbanstatus')
      .innerJoin('kanbanstatus.project', 'project')
      .where('timeentry.task = :taskid', { taskid })
      .groupBy('task.name')
      .addGroupBy('kanbanstatus.name')
      .addGroupBy('project.name')
      .getRawOne();

    // .findOne({
    //   select: ['workedtime'],
    //   relations: { task: true },
    //   where: { task: { id: Equal(taskid) } },
    // });
  }
}
