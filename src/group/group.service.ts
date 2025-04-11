import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
    ) {}

    findAll() {
        return this.groupRepository.find();
    }

    async findOne(id: string) {
        const group = await this.groupRepository.findOne({ where: { id } });

        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }

        return group;
    }

    create(createGroupDto: CreateGroupDto) {
        const group = this.groupRepository.create({
            ...createGroupDto,
            inviteCode: createGroupDto.inviteCode || this.generateInviteCode(),
        });

        return this.groupRepository.save(group);
    }

    async update(id: string, updateGroupDto: UpdateGroupDto) {
        await this.findOne(id);
        await this.groupRepository.update(id, updateGroupDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const result = await this.groupRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }

        return { deleted: true };
    }

    async joinGroup(groupId: string, userId: string) {
        const group = await this.findOne(groupId);

        if (!group.memberIds) {
            group.memberIds = [];
        }

        if (group.memberIds.includes(userId)) {
            throw new BadRequestException(
                `User with ID ${userId} is already a member of the group`,
            );
        }

        // add member
        group.memberIds.push(userId);
        await this.groupRepository.save(group);

        return { message: `User with ID ${userId} has joined the group` };
    }

    async leaveGroup(groupId: string, userId: string) {
        const group = await this.findOne(groupId);

        if (!group.memberIds || !group.memberIds.includes(userId)) {
            throw new BadRequestException(
                `User with ID ${userId} is not a member of the group`,
            );
        }

        // remove member
        group.memberIds = group.memberIds.filter(
            (memberId) => memberId !== userId,
        );
        await this.groupRepository.save(group);

        return { message: `User with ID ${userId} has left the group` };
    }

    private generateInviteCode(): string {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
}
