import { Test, TestingModule } from '@nestjs/testing';
import { TasktypesService } from './tasktypes.service';

describe('TasktypesService', () => {
  let service: TasktypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasktypesService],
    }).compile();

    service = module.get<TasktypesService>(TasktypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
