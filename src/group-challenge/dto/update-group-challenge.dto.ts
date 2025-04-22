import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupChallengeDto } from './create-group-challenge.dto';

export class UpdateGroupChallengeDto extends PartialType(
    CreateGroupChallengeDto,
) {}
