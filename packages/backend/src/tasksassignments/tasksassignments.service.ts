import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { TaskAssignment } from './taskassignment.entity';

@Injectable()
export class TasksAssignmentsService {
  constructor(
    @InjectRepository(TaskAssignment)
    private tasksAssignmentsRepository: Repository<TaskAssignment>,
  ) {}

  async create(taskassignment: TaskAssignment): Promise<TaskAssignment> {
    return await this.tasksAssignmentsRepository.save(taskassignment);
  }

  async update(
    id: string,
    taskassignment: TaskAssignment,
  ): Promise<UpdateResult> {
    return await this.tasksAssignmentsRepository.update(id, taskassignment);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.tasksAssignmentsRepository.delete(id);
  }

  async findAll(): Promise<TaskAssignment[]> {
    return await this.tasksAssignmentsRepository.find({
      relations: ['userproject', 'task'],
    });
  }

  async findOne(id: string): Promise<TaskAssignment> {
    return await this.tasksAssignmentsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.tasksAssignmentsRepository.delete(id);
  }

  async findAllUsersOfTask(taskid: string): Promise<TaskAssignment[]> {
    return await this.tasksAssignmentsRepository.find({
      select: ['userproject'],
      relations: {
        userproject: { user: { role: true } },
      },
      where: { task: { id: Equal(taskid) } },
    });
  }
}
