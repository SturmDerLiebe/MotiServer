import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    async findAll(): Promise<User[]> {
        return this.find();
    }

    async findOneById(id: number): Promise<User | null> {
        return this.findOne({ where: { user_id: String(id) } });
    }

    async createUser(user: User): Promise<User> {
        return this.save(user);
    }

    async updateUser(id: number, user: User): Promise<void> {
        await this.update(id, user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.delete(id);
    }
}
