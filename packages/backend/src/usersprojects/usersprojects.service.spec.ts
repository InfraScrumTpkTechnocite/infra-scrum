import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsService } from './usersprojects.service';

describe('UsersprojectsService', () => {
  let service: UsersprojectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersprojectsService],
    }).compile();

    service = module.get<UsersprojectsService>(UsersprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
