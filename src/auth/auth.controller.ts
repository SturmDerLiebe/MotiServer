import {
    Controller,
    Post,
    Headers,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('verify')
    async verifyToken(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace('Bearer ', '');
        const userId = await this.authService.authenticate(token);

        return { message: 'Token verified', userId };
    }
}
