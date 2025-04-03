import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class SecurityProvider {
    hashPassword(password: string): Promise<string> {
        return hash(password);
    }

    validatePassword(
        hashedPassword: string,
        password: string,
    ): Promise<boolean> {
        return (
            verify(hashedPassword, password)
                // NOTE: This happens when hashedPassword is of wrong format according to argon2
                .catch(() => false)
        );
    }
}
