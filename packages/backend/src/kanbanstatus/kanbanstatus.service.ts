import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { KanbanStatus } from './kanbanstatus.entity';

@Injectable()
export class KanbanstatusService {
  constructor(
    @InjectRepository(KanbanStatus)
    private kanbanStatusRepository: Repository<KanbanStatus>,
  ) {}

  async create(kanbanStatus: KanbanStatus): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository.save(kanbanStatus);
  }

  async update(id: string, kanbanStatus: KanbanStatus): Promise<UpdateResult> {
    return await this.kanbanStatusRepository.update(id, kanbanStatus);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.kanbanStatusRepository.delete(id);
  }

  async findAll(): Promise<KanbanStatus[]> {
    return await this.kanbanStatusRepository.find({ relations: ['project'] });
  }

  async findOne(id: string): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository.findOneBy({ id });
  }

  async findOneByProjectAndName(
    projectid: string,
    name: string,
  ): Promise<KanbanStatus> {
    return await this.kanbanStatusRepository
      .createQueryBuilder('kanbanstatus')
      .where('kanbanstatus.project = :projectid', { projectid })
      .andWhere('kanbanstatus.name = :name', { name })
      .getOneOrFail();
  }

  async findAllByProject(projectid: string): Promise<KanbanStatus[]> {
    return await this.kanbanStatusRepository
      .createQueryBuilder('kanbanstatus')
      .where('kanbanstatus.project = :projectid', { projectid })
      .getMany();
  }
}
