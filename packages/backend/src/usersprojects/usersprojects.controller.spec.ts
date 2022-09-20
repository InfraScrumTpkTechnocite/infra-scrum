import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsController } from './usersprojects.controller';

describe('UsersprojectsController', () => {
  let controller: UsersprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersprojectsController],
    }).compile();

    controller = module.get<UsersprojectsController>(UsersprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
