import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
    generateVerificationToken(userId: string): string {
        // generate the token

        return 'generated token';
    }

    validateVerificationToken(token: string): boolean {
        // validate the token

        return true;
    }
}
