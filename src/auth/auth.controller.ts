import {
    Body,
    Controller,
    Delete,
    HttpCode,
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
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.input';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    register(@Body() body: RegisterUserDto) {
        return body.username; // TODO #26 : Call UserService.createUser() here instead
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(204)
    @Post('login')
    login() {
        // TODO: Full Endpoint is done in #16
    }

    @Delete('logout')
    logout(@Req() request: Request) {
        request.logout(() => {});
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
