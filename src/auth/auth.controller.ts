import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.input';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { Public } from './dto/public.decorator';

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
}
