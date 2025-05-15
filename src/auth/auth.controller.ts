import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Post,
    Req,
    UseGuards,
    Put,
    Param,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.input';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { Public } from './public.decorator';
import { ChallengeDTO } from './dto/challenge.dto';
import {
    RegistrationResponseJSON,
    AuthenticationResponseJSON,
} from '@simplewebauthn/server/script/deps';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    async register(@Body() body: RegisterUserDto) {
        try {
            const user = await this.authService.createUser(
                body.username,
                body.password,
            );
            return { message: 'User registered successfully', user };
        } catch {
            throw new BadRequestException('Error registering user');
        }
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

    // webauthn endpoints
    @Post('webauthn/register')
    async webauthnRegister(@Body('userId') userId: string) {
        try {
            const challenge =
                await this.authService.generateRegistrationOptions(userId);
            return new ChallengeDTO(challenge);
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

    @Post('webauthn/authenticate')
    async webauthnAuthenticate(@Body('userId') userId: string) {
        try {
            const challenge =
                await this.authService.generateAuthenticationOptions(userId);
            return new ChallengeDTO(challenge);
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
