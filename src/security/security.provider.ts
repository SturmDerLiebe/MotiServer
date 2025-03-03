import { Injectable } from '@nestjs/common';
import { verify, hash } from 'argon2';

@Injectable()
export class SecurityProvider {
    hashPassword(password: string): Promise<string> {
        return hash(password);
    }

    validatePassword(
        hashedPassword: string,
        password: string,
    ): Promise<boolean> {
        return verify(hashedPassword, password);
    }
}
