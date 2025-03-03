import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
    generateVerificationToken(userId: string): string {
        void userId; // TODO: #36 - generate the token

        return 'generated token';
    }

    validateVerificationToken(token: string): boolean {
        void token; // TODO: #36 - validate the token

        return true;
    }
}
