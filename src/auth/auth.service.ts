import { Injectable } from '@nestjs/common';
import { TempUserEntity } from './session-serializer.provider';

@Injectable()
export class AuthService {
    validateUser(username: string, pass: string): TempUserEntity | null {
        const user =
            username === 'TestUser'
                ? { id: '1', username, password: 'TestPw' }
                : null; // TODO #26: get user by username form user.service
        if (user !== null && pass === user.password) return user;
        else return null; // TODO #31: use encrypted comparison
    }
}
