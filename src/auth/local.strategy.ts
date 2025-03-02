import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    /**
     * @throws UnauthorizedException
     * @param username - username extracted from the Request-Body
     * @param password - unencrypted password extracted from the Request-Body
     */
    async validate(username: string, password: string): Promise<boolean> {
        const isUserValidated = await this.authService.validateUser(
            username,
            password,
        );
        if (!isUserValidated) throw new UnauthorizedException();
        else return true;
    }
}
