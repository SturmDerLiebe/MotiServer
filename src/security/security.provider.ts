import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class SecurityProvider {
    hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    validatePassword(
        hashedPassword: string,
        password: string,
    ): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }
}
