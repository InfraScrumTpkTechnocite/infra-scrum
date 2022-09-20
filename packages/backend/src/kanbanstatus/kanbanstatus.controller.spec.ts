import { Test, TestingModule } from '@nestjs/testing';
import { KanbanstatusController } from './kanbanstatus.controller';

describe('KanbanstatusController', () => {
  let controller: KanbanstatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanstatusController],
    }).compile();

    controller = module.get<KanbanstatusController>(KanbanstatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
