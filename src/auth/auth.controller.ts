import {
    Controller,
    Post,
    Headers,
    UnauthorizedException,
    Body,
    HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.input';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(204)
    login() {}

    @Post('register')
    register(@Body() body: RegisterUserDto) {
        return body.username; // TODO #26 : Call UserService.createUser() here instead
    }

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
}
