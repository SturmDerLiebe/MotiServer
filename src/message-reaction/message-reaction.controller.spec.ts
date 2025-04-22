import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionController } from './message-reaction.controller';
import { MessageReactionService } from './message-reaction.service';

describe('MessageReactionController', () => {
  let controller: MessageReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageReactionController],
      providers: [MessageReactionService],
    }).compile();

    controller = module.get<MessageReactionController>(MessageReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
