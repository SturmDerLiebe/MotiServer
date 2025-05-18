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
import { GroupMember } from '../group-member/entities/group-member.entity';
import * as crypto from 'crypto';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(GroupMember)
        private groupMemberRepository: Repository<GroupMember>,
    ) {}

    findAll() {
        return this.groupRepository.find({
            relations: ['members', 'messages', 'challenges'],
        });
    }

    async findOne(id: string) {
        const group = await this.groupRepository.findOne({
            where: { group_id: Number(id) },
            relations: ['members', 'messages', 'challenges'],
        });

        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }

        return group;
    }

    create(createGroupDto: CreateGroupDto) {
        const inviteCode = this.generateInviteCode();
        const group = this.groupRepository.create({
            ...createGroupDto,
            invite_code: inviteCode,
        });

        return this.groupRepository.save(group);
    }

    async update(id: string, updateGroupDto: UpdateGroupDto) {
        const group = await this.findOne(id);
        Object.assign(group, updateGroupDto);
        return this.groupRepository.save(group);
    }

    async remove(id: string) {
        const result = await this.groupRepository.delete(Number(id));

        if (result.affected === 0) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }

        return { deleted: true };
    }

    async joinGroup(groupId: string, userId: string) {
        const existingMember = await this.groupMemberRepository.findOne({
            where: {
                group: { group_id: Number(groupId) },
                user: { user_id: userId },
            },
        });

        if (existingMember) {
            throw new BadRequestException(
                `User with ID ${userId} is already a member of the group`,
            );
        }

        // Create a new group member
        const newMember = this.groupMemberRepository.create({
            group: { group_id: Number(groupId) },
            user: { user_id: userId },
        });
        await this.groupMemberRepository.save(newMember);

        return { message: `User with ID ${userId} has joined the group` };
    }

    async leaveGroup(groupId: string, userId: string) {
        const existingMember = await this.groupMemberRepository.findOne({
            where: {
                group: { group_id: Number(groupId) },
                user: { user_id: userId },
            },
        });

        if (!existingMember) {
            throw new BadRequestException(
                `User with ID ${userId} is not a member of the group`,
            );
        }

        // Remove the group member
        await this.groupMemberRepository.remove(existingMember);

        return { message: `User with ID ${userId} has left the group` };
    }

    private generateInviteCode(): string {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }
}
