import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWeeklyTargetDto } from './create-user-weekly-target.dto';

export class UpdateUserWeeklyTargetDto extends PartialType(
    CreateUserWeeklyTargetDto,
) {}
