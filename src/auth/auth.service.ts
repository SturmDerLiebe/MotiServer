import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import {
    AuthenticationResponseJSON,
    RegistrationResponseJSON,
} from '@simplewebauthn/server/script/deps';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(PasskeyEntity)
        private readonly passkeyRepository: Repository<PasskeyEntity>,

        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
    ) {}

    async findPasskeyByCredentialID(
        credentialID: Buffer,
    ): Promise<PasskeyEntity | null> {
        return await this.passkeyRepository.findOne({
            where: { credentialID },
        });
    }

    async updatePasskeyCounter(
        credentialID: Buffer,
        newCounter: number,
    ): Promise<void> {
        await this.passkeyRepository.update(
            { credentialID },
            { counter: newCounter },
        );
    }

    async createUser(email: string, password: string): Promise<User> {
        const hashedPassword = await argon2.hash(password);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        });
        return await this.userRepository.save(user);
    }

    async changePassword(userId: number, newPassword: string): Promise<void> {
        const hashedPassword = await argon2.hash(newPassword);
        await this.userRepository.update(userId, { password: hashedPassword });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return null;

        const isPasswordValid = await argon2.verify(user.password, password);
        return isPasswordValid ? user : null;
    }

    async generateRegistrationOptions(
        userId: string,
    ): Promise<PublicKeyCredentialCreationOptionsJSON> {
        const options = await generateRegistrationOptions({
            rpID: 'motiemate.com',
            rpName: 'Motimate',
            userID: userId,
            userName: 'user@example.com',
        });

        const user = await this.userRepository.findOne({
            where: { id: Number(userId) },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const challenge = this.challengeRepository.create({
            user,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        await this.challengeRepository.save(challenge);

        return options;
    }

    async verifyRegistrationResponse(
        response: RegistrationResponseJSON,
        userId: string,
    ) {
        const challenge = await this.challengeRepository.findOne({
            where: { user: { id: Number(userId) } },
        });

        if (!challenge) throw new UnauthorizedException('Challenge not found');

        const verification = await verifyRegistrationResponse({
            response,
            expectedChallenge: challenge.challenge,
            expectedOrigin: 'https://motiemate.com',
            expectedRPID: 'motiemate.com',
        });

        await this.challengeRepository.delete(challenge.id);

        return verification;
    }

    async generateAuthenticationOptions(userId: string) {
        const options = await generateAuthenticationOptions({
            rpID: 'motiemate.com',
        });

        const user = await this.userRepository.findOne({
            where: { id: Number(userId) },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const challenge = this.challengeRepository.create({
            user,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await this.challengeRepository.save(challenge);

        return options;
    }

    async verifyAuthenticationResponse(
        response: AuthenticationResponseJSON,
        userId: string,
    ) {
        const challenge = await this.challengeRepository.findOne({
            where: { user: { id: Number(userId) } },
        });

        if (!challenge) throw new UnauthorizedException('Challenge not found');

        const credentialIDBuffer = Buffer.from(response.id);
        const passkey =
            await this.findPasskeyByCredentialID(credentialIDBuffer);

        if (!passkey) throw new UnauthorizedException('Passkey not found');

        const verification = await verifyAuthenticationResponse({
            response,
            authenticator: {
                credentialID: passkey.credentialID,
                credentialPublicKey: passkey.publicKey,
                counter: passkey.counter,
            },
            expectedChallenge: challenge.challenge,
            expectedOrigin: 'https://motiemate.com',
            expectedRPID: 'motiemate.com',
        });

        if (!verification.verified)
            throw new UnauthorizedException('Authentication failed');

        await this.updatePasskeyCounter(
            passkey.credentialID,
            verification.authenticationInfo.newCounter,
        );

        await this.challengeRepository.delete(challenge.id);

        return verification;
    }
}
