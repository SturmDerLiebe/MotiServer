import { Challenge } from '../entities/challenge.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ChallengeDTO {
    @ApiProperty({
        description: 'The challenge string for WebAuthn registration',
        example: 'dGhpcyBpcyBhIHNhbXBsZSBjaGFsbGVuZ2U=',
        type: String,
        required: true,
    })
    challenge: string;

    @ApiProperty({
        description: 'The expiration date of the challenge',
        example: '2024-10-01T12:00:00Z',
        type: Date,
        required: true,
    })
    expiresAt: Date;

    constructor(challenge: Challenge) {
        this.challenge = challenge.challenge;
        this.expiresAt = challenge.expiresAt;
    }
}
