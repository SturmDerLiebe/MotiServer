import {
    Controller,
    Post,
    Headers,
    UnauthorizedException,
    Body,
    Put,
    Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';

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
        const user = await this.authService.createUser(email, password);
        return { message: 'User registered successfully', user };
    }

    @Put('change-password/:id')
    async changePassword(
        @Param('id') userId: number,
        @Body('newPassword') newPassword: string,
    ) {
        await this.authService.changePassword(userId, newPassword);
        return { message: 'Password changed successfully' };
    }
}
