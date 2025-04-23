import { Challenge } from '../entities/challenge.entity';

export class ChallengeDTO {
    challenge: string;
    expiresAt: Date;

    constructor(challenge: Challenge) {
        this.challenge = challenge.challenge;
        this.expiresAt = challenge.expiresAt;
    }
}
