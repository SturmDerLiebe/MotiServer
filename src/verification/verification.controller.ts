import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) {}

    @Post('send')
    sendVerification(@Body('userId') userId: string) {
        const token =
            this.verificationService.generateVerificationToken(userId);

        // TODO: #36 - add logic to send the token via email or sms

        return { message: 'verification sent', token };
    }

    @Post('confirm')
    confirmVerification(@Body('token') token: string) {
        try {
            // TODO: #17 - Please use Exception Filters to treat Invalidity and Errors
            const isValid =
                this.verificationService.validateVerificationToken(token);
            if (isValid) {
                return { message: 'verification successful' };
            } else {
                return { message: 'invalid token' };
            }
        } catch (error) {
            return {
                message: 'error confirming verification',
                error: error instanceof Error ? error.message : 'unknown error',
            };
        }
    }
}
