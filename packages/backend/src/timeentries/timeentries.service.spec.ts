import { Test, TestingModule } from '@nestjs/testing';
import { TimeentriesService } from './timeentries.service';

describe('TimeentriesService', () => {
  let service: TimeentriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeentriesService],
    }).compile();

    service = module.get<TimeentriesService>(TimeentriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
