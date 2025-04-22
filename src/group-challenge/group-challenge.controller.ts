import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GroupChallengeService } from './group-challenge.service';
import { CreateGroupChallengeDto } from './dto/create-group-challenge.dto';
import { UpdateGroupChallengeDto } from './dto/update-group-challenge.dto';

@Controller('group-challenge')
export class GroupChallengeController {
    constructor(
        private readonly groupChallengeService: GroupChallengeService,
    ) {}

    @Post()
    create(@Body() createGroupChallengeDto: CreateGroupChallengeDto) {
        return this.groupChallengeService.create(createGroupChallengeDto);
    }

    @Get()
    findAll() {
        return this.groupChallengeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupChallengeService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGroupChallengeDto: UpdateGroupChallengeDto,
    ) {
        return this.groupChallengeService.update(+id, updateGroupChallengeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.groupChallengeService.remove(+id);
    }
}
