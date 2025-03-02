import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.input';

@Controller('auth')
export class AuthController {
    @Post('login')
    @HttpCode(204)
    login() {}

    @Post('register')
    register(@Body() body: RegisterUserDto) {
        return body.username; // TODO #26 : Call UserService.createUser() here instead
    }
}
