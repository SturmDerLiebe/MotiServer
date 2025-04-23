import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createGroupDto: CreateGroupDto) {
        const group = await this.groupService.create(createGroupDto);

        // return group details with invite code
        return {
            message: 'Group created successfully',
            group: {
                id: group.id,
                groupName: group.groupName,
                inviteCode: group.inviteCode,
            },
        };
    }

    @Post(':id/join')
    @HttpCode(HttpStatus.OK)
    async join(@Param('id') groupId: string, @Body('userId') userId: string) {
        await this.groupService.joinGroup(groupId, userId);
        // success message
        return {
            message: `User with ID ${userId} has successfully joined the group with ID ${groupId}`,
        };
    }

    // TODO #98: Add missing endpoints

    @Put(':id')
    update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupService.update(id, updateGroupDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.groupService.remove(id);
    }
}
