import {
    Controller,
    Post,
    Headers,
    UnauthorizedException,
    Body,
    Put,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    RegistrationResponseJSON,
    AuthenticationResponseJSON,
} from '@simplewebauthn/server/script/deps';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('verify')
    verifyToken(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace('Bearer ', '');
        void token; // TODO #16: Will be replaced and implemented properly
        // const userId = await this.authService.authenticate(token);

        return { message: 'Token verified' };
    }

    @Post('register')
    async register(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        try {
            const user = await this.authService.createUser(email, password);
            return { message: 'User registered successfully', user };
        } catch {
            throw new BadRequestException('Error registering user');
        }
    }

    @Put('change-password/:id')
    async changePassword(
        @Param('id') userId: number,
        @Body('newPassword') newPassword: string,
    ) {
        try {
            await this.authService.changePassword(userId, newPassword);
            return { message: 'Password changed successfully' };
        } catch {
            throw new BadRequestException('Error changing password');
        }
    }

    // webauthn registration
    @Post('webauthn/register')
    async webauthnRegister(@Body('userId') userId: string) {
        try {
            const options =
                await this.authService.generateRegistrationOptions(userId);
            return { options };
        } catch {
            throw new BadRequestException(
                'Error generating registration options',
            );
        }
    }

    @Post('webauthn/register/verify')
    async webauthnRegisterVerify(
        @Body() response: RegistrationResponseJSON,
        @Body('userId') userId: string,
    ) {
        try {
            const verification =
                await this.authService.verifyRegistrationResponse(
                    response,
                    userId,
                );
            return { verification };
        } catch {
            throw new UnauthorizedException(
                'Error verifying registration response',
            );
        }
    }

    // webauthn authentication
    @Post('webauthn/authenticate')
    async webauthnAuthenticate(@Body('userId') userId: string) {
        try {
            const options =
                await this.authService.generateAuthenticationOptions(userId);
            return { options };
        } catch {
            throw new BadRequestException(
                'Error generating authentication options',
            );
        }
    }

    @Post('webauthn/authenticate/verify')
    async webauthnAuthenticateVerify(
        @Body() response: AuthenticationResponseJSON,
        @Body('userId') userId: string,
    ) {
        try {
            const verification =
                await this.authService.verifyAuthenticationResponse(
                    response,
                    userId,
                );
            return { verification };
        } catch {
            throw new UnauthorizedException(
                'Error verifying authentication response',
            );
        }
    }
}
