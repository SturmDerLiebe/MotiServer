import { Module } from '@nestjs/common';
import { GroupChallengeService } from './group-challenge.service';
import { GroupChallengeController } from './group-challenge.controller';

@Module({
    controllers: [GroupChallengeController],
    providers: [GroupChallengeService],
})
export class GroupChallengeModule {}
