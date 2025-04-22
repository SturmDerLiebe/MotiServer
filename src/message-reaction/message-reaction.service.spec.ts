import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionService } from './message-reaction.service';

describe('MessageReactionService', () => {
  let service: MessageReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageReactionService],
    }).compile();

    service = module.get<MessageReactionService>(MessageReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
