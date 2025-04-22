import { Test, TestingModule } from '@nestjs/testing';
import { GroupChallengeService } from './group-challenge.service';

describe('GroupChallengeService', () => {
    let service: GroupChallengeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GroupChallengeService],
        }).compile();

        service = module.get<GroupChallengeService>(GroupChallengeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
