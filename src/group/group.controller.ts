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
        // success
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
