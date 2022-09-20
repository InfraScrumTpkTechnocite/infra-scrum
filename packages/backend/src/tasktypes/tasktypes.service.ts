import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskType } from './tasktype.entity';

@Injectable()
export class TasktypesService {
  constructor(
    @InjectRepository(TaskType)
    private tasksTypesRepository: Repository<TaskType>,
  ) {}

  async create(tasktype: TaskType): Promise<TaskType> {
    return await this.tasksTypesRepository.save(tasktype);
  }

  async update(id: string, tasktype: TaskType): Promise<UpdateResult> {
    return await this.tasksTypesRepository.update(id, tasktype);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksTypesRepository.delete(id);
  }

  async findAll(): Promise<TaskType[]> {
    return await this.tasksTypesRepository.find();
  }

  async findOne(id: string): Promise<TaskType> {
    return await this.tasksTypesRepository.findOneBy({ id });
  }

  async findOneByLabel(label: string): Promise<TaskType> {
    return await this.tasksTypesRepository.findOneBy({ label: label });
  }
}
