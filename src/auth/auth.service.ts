import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(email: string, password: string): Promise<User> {
        const hashedPassword = await argon2.hash(password);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        });
        return await this.userRepository.save(user);
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        const hashedPassword = await argon2.hash(newPassword);
        await this.userRepository.update(userId, { password: hashedPassword });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
}
