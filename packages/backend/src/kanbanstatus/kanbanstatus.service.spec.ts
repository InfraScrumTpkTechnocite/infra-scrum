import { Test, TestingModule } from '@nestjs/testing';
import { KanbanstatusService } from './kanbanstatus.service';

describe('KanbanstatusService', () => {
  let service: KanbanstatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KanbanstatusService],
    }).compile();

    service = module.get<KanbanstatusService>(KanbanstatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
