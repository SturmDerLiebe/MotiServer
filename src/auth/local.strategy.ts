import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    // async validate(username: string, password: string): Promise<boolean> {
    /**
     * @throws UnauthorizedException
     * @param username - username given by a user
     * @param password - unencrypted password given by a user
     */
    validate(username: string, password: string): boolean {
        const isUserValidated = this.authService.validateUser(
            username,
            password,
        );
        if (!isUserValidated) throw new UnauthorizedException();
        else return true;
    }
}
