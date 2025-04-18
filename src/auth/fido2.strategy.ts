import {
    Strategy as PassportFido2Strategy,
    SessionChallengeStore,
    StrategyOptions,
} from 'passport-fido2-webauthn';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class Fido2Strategy extends PassportStrategy(PassportFido2Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super(
            { store: new SessionChallengeStore() } satisfies StrategyOptions, 
            async function verify(
                userHandle: string,
                cb: (error: any, user?: User) => void,
            ) => {
                try {
                    const user = await this.userRepository.findOne({
                        where: { id: userHandle },
                    });
                    if (!user) {
                        return cb(new UnauthorizedException('User not found'));
                    }
                    cb(null, user);
                } catch (error) {
                    cb(error);
                }
            },
        );
    }

    async validate(publicKey: string): Promise<User> {
        try {
            // Query the user by publicKey in the passkeys relationship
            const user = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.passkeys', 'passkey')
                .where('passkey.publicKey = :publicKey', { publicKey })
                .getOne();

            if (!user) {
                throw new UnauthorizedException('Invalid public key');
            }

            return user;
        } catch (error) {
            console.error('Error during FIDO2 validation:', error);
            throw new UnauthorizedException('Validation failed');
        }
    }
}
function cb(arg0: UnauthorizedException) {
    throw new Error('Function not implemented.');
}

