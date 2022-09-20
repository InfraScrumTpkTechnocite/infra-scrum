import { Test, TestingModule } from '@nestjs/testing';
import { TasktypesController } from './tasktypes.controller';

describe('TasktypesController', () => {
  let controller: TasktypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasktypesController],
    }).compile();

    controller = module.get<TasktypesController>(TasktypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
