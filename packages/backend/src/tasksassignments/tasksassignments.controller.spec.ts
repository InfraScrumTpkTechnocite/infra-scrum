import { Test, TestingModule } from '@nestjs/testing';
import { TasksAssignmentsController } from './tasksassignments.controller';

describe('TasksassignmentsController', () => {
  let controller: TasksAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksAssignmentsController],
    }).compile();

    controller = module.get<TasksAssignmentsController>(
      TasksAssignmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
