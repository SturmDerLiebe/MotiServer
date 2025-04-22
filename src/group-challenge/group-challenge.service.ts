import { Injectable } from '@nestjs/common';
import { CreateGroupChallengeDto } from './dto/create-group-challenge.dto';
import { UpdateGroupChallengeDto } from './dto/update-group-challenge.dto';

@Injectable()
export class GroupChallengeService {
    create(createGroupChallengeDto: CreateGroupChallengeDto) {
        return 'This action adds a new groupChallenge';
    }

    findAll() {
        return `This action returns all groupChallenge`;
    }

    findOne(id: number) {
        return `This action returns a #${id} groupChallenge`;
    }

    update(id: number, updateGroupChallengeDto: UpdateGroupChallengeDto) {
        return `This action updates a #${id} groupChallenge`;
    }

    remove(id: number) {
        return `This action removes a #${id} groupChallenge`;
    }
}
