import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {
        super(
            groupRepository.target,
            groupRepository.manager,
            groupRepository.queryRunner,
        );
    }

    async findById(id: number): Promise<Group | null> {
        return this.findOne({ where: { group_id: id } });
    }

    async findAll(): Promise<Group[]> {
        return this.find();
    }

    async createGroup(group: Group): Promise<Group> {
        return this.save(group);
    }

    async updateGroup(
        id: number,
        group: Partial<Group>,
    ): Promise<Group | null> {
        await this.update(id, group);
        return this.findById(id);
    }

    async deleteGroup(id: number): Promise<void> {
        await this.delete(id);
    }
}
