import { Injectable, NotFoundException } from '@nestjs/common';
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
        await this.findOne(id); // Check if exists
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

    private generateInviteCode(): string {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
}
