import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    // TODO: async validateUser(username: string, pass: string): Promise<boolean> {
    validateUser(username: string, pass: string): boolean {
        const user = { username: 'TestUser', encPassword: 'TestPw' }; // TODO: get user by username form user.service #26
        return user !== null && pass === user.encPassword; // TODO: use encrypted comparison #31
    }
}
