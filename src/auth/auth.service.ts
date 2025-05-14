import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SecurityProvider } from '../security/security.provider';
import { TempUserEntity } from './session-serializer.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';
import * as argon2 from 'argon2';
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

@Injectable()
export class AuthService {
    constructor(
        private readonly securityProvider: SecurityProvider,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(PasskeyEntity)
        private readonly passkeyRepository: Repository<PasskeyEntity>,

        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
    ) {}

    async validateUser(
        username: string,
        submittedPassword: string,
    ): Promise<TempUserEntity | null> {
        const user =
            username === 'TestUser'
                ? { id: '1', username, password: 'TestPw' }
                : null; // TODO #26: get user by username from user.service
        if (
            user !== null &&
            (await this.securityProvider.validatePassword(
                user.password,
                submittedPassword,
            ))
        )
            return user;
        else return null;
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

    async generateRegistrationOptions(userId: string): Promise<Challenge> {
        const user = await this.userRepository.findOne({
            where: { user_id: userId.toString() },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const options = await generateRegistrationOptions({
            rpID: 'motiemate.com',
            rpName: 'Motimate',
            userID: userId,
            userName: user.email,
        });

        const challenge = this.challengeRepository.create({
            user,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        await this.challengeRepository.save(challenge);

        return challenge;
    }

    async verifyRegistrationResponse(
        response: RegistrationResponseJSON,
        userId: string,
    ) {
        const challenge = await this.challengeRepository.findOne({
            where: { user: { user_id: userId.toString() } },
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

    async generateAuthenticationOptions(userId: string): Promise<Challenge> {
        const user = await this.userRepository.findOne({
            where: { user_id: userId.toString() },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const options = await generateAuthenticationOptions({
            rpID: 'motiemate.com',
        });

        const challenge = this.challengeRepository.create({
            user,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await this.challengeRepository.save(challenge);

        return challenge;
    }

    async verifyAuthenticationResponse(
        response: AuthenticationResponseJSON,
        userId: string,
    ) {
        const challenge = await this.challengeRepository.findOne({
            where: { user: { user_id: userId.toString() } },
        });

        if (!challenge) throw new UnauthorizedException('Challenge not found');

        const credentialIDBuffer = Buffer.from(response.id);
        const passkey = await this.passkeyRepository.findOne({
            where: { credentialID: credentialIDBuffer },
        });

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

        await this.passkeyRepository.update(
            { credentialID: passkey.credentialID },
            { counter: verification.authenticationInfo.newCounter },
        );

        await this.challengeRepository.delete(challenge.id);

        return verification;
    }
}
