import { Test, TestingModule } from '@nestjs/testing';
import { UserWeeklyTargetService } from './user-weekly-target.service';

describe('UserWeeklyTargetService', () => {
    let service: UserWeeklyTargetService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserWeeklyTargetService],
        }).compile();

        service = module.get<UserWeeklyTargetService>(UserWeeklyTargetService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
