import { Test, TestingModule } from '@nestjs/testing';
import { TimeentriesController } from './timeentries.controller';

describe('TimeentriesController', () => {
  let controller: TimeentriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeentriesController],
    }).compile();

    controller = module.get<TimeentriesController>(TimeentriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
