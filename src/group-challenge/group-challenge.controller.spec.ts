import { Test, TestingModule } from '@nestjs/testing';
import { GroupChallengeController } from './group-challenge.controller';
import { GroupChallengeService } from './group-challenge.service';

describe('GroupChallengeController', () => {
    let controller: GroupChallengeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GroupChallengeController],
            providers: [GroupChallengeService],
        }).compile();

        controller = module.get<GroupChallengeController>(
            GroupChallengeController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
