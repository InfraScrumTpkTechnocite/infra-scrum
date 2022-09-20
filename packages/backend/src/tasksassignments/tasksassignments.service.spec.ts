import { Test, TestingModule } from '@nestjs/testing';
import { TasksassignmentsService } from './tasksassignments.service';

describe('TasksassignmentsService', () => {
  let service: TasksassignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksassignmentsService],
    }).compile();

    service = module.get<TasksassignmentsService>(TasksassignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
