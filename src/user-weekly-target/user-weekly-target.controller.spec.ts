import { Test, TestingModule } from '@nestjs/testing';
import { UserWeeklyTargetController } from './user-weekly-target.controller';
import { UserWeeklyTargetService } from './user-weekly-target.service';

describe('UserWeeklyTargetController', () => {
  let controller: UserWeeklyTargetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWeeklyTargetController],
      providers: [UserWeeklyTargetService],
    }).compile();

    controller = module.get<UserWeeklyTargetController>(UserWeeklyTargetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
