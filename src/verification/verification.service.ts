import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
    generateVerificationToken(userId: string): string {
        // TODO: #36 - generate the token

        return 'generated token';
    }

    validateVerificationToken(token: string): boolean {
        // validate the token

        return true;
    }
}
