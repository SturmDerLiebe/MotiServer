import { Strategy as PassportFido2Strategy } from 'passport-fido2-webauthn';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// define user type
type User = {
    id: string;
    publicKey: string;
};

@Injectable()
export class Fido2Strategy extends PassportStrategy(PassportFido2Strategy) {
    constructor() {
        super(
            {
                rpID: 'motiemate.com',
                origin: 'https://motimate.com',
                userVerification: 'required',
                timeout: 86400,
            },
            async (
                publicKey: string,
                done: (error: any, user?: User | false) => void,
            ) => {
                try {
                    // findUserByPublicKey to retrieve user data
                    const user: User | null =
                        await findUserByPublicKey(publicKey);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            },
        );
    }
}

async function findUserByPublicKey(publicKey: string): Promise<User | null> {
    // database lookup
    return null; // this should be actual user output
}
