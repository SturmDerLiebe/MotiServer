import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    validateUser(username: string, pass: string): boolean {
        const user =
            username === 'TestUser'
                ? { username, encPassword: 'TestPw' }
                : null; // TODO #26: get user by username form user.service
        return user !== null && pass === user.encPassword; // TODO #31: use encrypted comparison
    }
}
