import { Injectable } from '@nestjs/common';
import { SecurityProvider } from '../security/security.provider';

@Injectable()
export class AuthService {
    constructor(private readonly securityProvider: SecurityProvider) {}

    async validateUser(username: string, password: string): Promise<boolean> {
        const user =
            username === 'TestUser'
                ? { username, encPassword: 'TestPw' }
                : null; // TODO #26: get user by username form user.service
        return (
            user !== null &&
            (await this.securityProvider.validatePassword(
                user.encPassword,
                password,
            ))
        );
    }
}
