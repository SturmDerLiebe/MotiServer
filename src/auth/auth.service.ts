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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly securityProvider: SecurityProvider,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(PasskeyEntity)
        private readonly passkeyRepository: Repository<PasskeyEntity>,

        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
    ) {}

    /**
     * Validate if an environment variable is set; throw an error if not.
     */
    private throwOnUndefinedEnvVariable(
        variable: string,
        value: string | undefined,
    ): string {
        if (!value) {
            throw new Error(`Environment variable ${variable} is not set`);
        }
        return value;
    }

    async validateUser(
        username: string,
        submittedPassword: string,
    ): Promise<TempUserEntity | null> {
        const user =
            username === 'TestUser'
                ? { id: '1', username, password: 'TestPw' }
                : null; // TODO: Replace this with a real user lookup
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
            rpID: this.throwOnUndefinedEnvVariable(
                'RP_ID',
                this.configService.get<string>('RP_ID'),
            ),
            rpName: this.throwOnUndefinedEnvVariable(
                'RP_NAME',
                this.configService.get<string>('RP_NAME'),
            ),
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
            expectedOrigin: this.throwOnUndefinedEnvVariable(
                'RP_ORIGIN',
                this.configService.get<string>('RP_ORIGIN'),
            ),
            expectedRPID: this.throwOnUndefinedEnvVariable(
                'RP_ID',
                this.configService.get<string>('RP_ID'),
            ),
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
            rpID: this.throwOnUndefinedEnvVariable(
                'RP_ID',
                this.configService.get<string>('RP_ID'),
            ),
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
            expectedOrigin: this.throwOnUndefinedEnvVariable(
                'RP_ORIGIN',
                this.configService.get<string>('RP_ORIGIN'),
            ),
            expectedRPID: this.throwOnUndefinedEnvVariable(
                'RP_ID',
                this.configService.get<string>('RP_ID'),
            ),
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
