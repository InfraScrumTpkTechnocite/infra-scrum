import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(project: Task): Promise<Task> {
    return await this.tasksRepository.save(project);
  }

  async update(id: string, project: Task): Promise<UpdateResult> {
    return await this.tasksRepository.update(id, project);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksRepository.delete(id);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: ['kanbanstatus', 'task', 'tasktype'],
    });
  }

  async findOne(id: string): Promise<Task> {
    return await this.tasksRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Task> {
    //console.log("ProjectsService - findOneByProjectname");
    return await this.tasksRepository.findOneBy({ name: name });
  }

  async findAllOfKanbanstatusid(kanbanstatusid: string): Promise<Task[]>{
    return await this.tasksRepository.find({
      select: ['kanbanstatus'],
      relations: { kanbanstatus: true, tasktype: true, sprint: true },
      where: { kanbanstatus: Equal(kanbanstatusid) },
    });
  }
}
