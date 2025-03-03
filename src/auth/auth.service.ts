import { Injectable } from '@nestjs/common';
import { SecurityProvider } from '../security/security.provider';
import { TempUserEntity } from './session-serializer.provider';

@Injectable()
export class AuthService {
    constructor(private readonly securityProvider: SecurityProvider) {}

    async validateUser(
        username: string,
        submittedPassword: string,
    ): Promise<TempUserEntity | null> {
        const user =
            username === 'TestUser'
                ? { id: '1', username, password: 'TestPw' }
                : null; // TODO #26: get user by username form user.service
        if (
            user !== null &&
            (await this.securityProvider.validatePassword(
                user.password,
                submittedPassword,
            ))
        )
            return user;
        else return null;
    }
}
