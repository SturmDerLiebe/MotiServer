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
import { Group } from './entities/group.entity';

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
        const group: Group = await this.groupService.create(createGroupDto); // type the group object

        // group details with invite code
        return {
            message: 'Group created successfully',
            group: {
                id: group.group_id,
                group_name: group.group_name,
                invite_code: group.invite_code,
            },
        };
    }

    @Post(':id/join')
    @HttpCode(HttpStatus.OK)
    async join(@Param('id') groupId: string, @Body('userId') userId: string) {
        await this.groupService.joinGroup(groupId, userId);
        const group = await this.groupService.findOne(groupId);
        return {
            message: `User with ID ${userId} has successfully joined the group with ID ${groupId}`,
            invite_code: group.invite_code,
        };
    }

    @Post(':id/leave')
    @HttpCode(HttpStatus.OK)
    async leave(@Param('id') groupId: string, @Body('userId') userId: string) {
        await this.groupService.leaveGroup(groupId, userId);
        return {
            message: `User with ID ${userId} has successfully left the group with ID ${groupId}`,
        };
    }

    @Get(':id/members')
    async getMembers(@Param('id') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        return group.members;
    }

    @Get(':id/group-info')
    async getGroupInfo(@Param('id') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        return {
            id: group.group_id,
            name: group.group_name,
            invite_code: group.invite_code,
            members: group.members,
            messages: group.messages,
            challenges: group.challenges,
        };
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupService.update(id, updateGroupDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.groupService.remove(id);
    }
}
