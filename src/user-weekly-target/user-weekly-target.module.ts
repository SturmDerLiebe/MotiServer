import { Module } from '@nestjs/common';
import { UserWeeklyTargetService } from './user-weekly-target.service';
import { UserWeeklyTargetController } from './user-weekly-target.controller';

@Module({
  controllers: [UserWeeklyTargetController],
  providers: [UserWeeklyTargetService],
})
export class UserWeeklyTargetModule {}
