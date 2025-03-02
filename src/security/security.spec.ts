import { Test, TestingModule } from '@nestjs/testing';
import { SecurityProvider } from './security.provider';

describe('Security', () => {
  let provider: SecurityProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityProvider],
    }).compile();

    provider = module.get<SecurityProvider>(SecurityProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
