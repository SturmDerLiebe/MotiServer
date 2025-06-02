import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { SupabaseService } from '../bucket/supabase.service';
import { SupabaseServiceMock } from '../bucket/__mock__/supabase.service';

describe('EmailService', () => {
    let service: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: SupabaseService, useValue: SupabaseServiceMock },
            ],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendVerificationCode', () => {
        it('should call signInWithOtp with correct parameters', async () => {
            SupabaseServiceMock.client.auth.signInWithOtp.mockResolvedValue({
                error: null,
            });

            const userEmail = 'test@example.com';
            await service.sendVerificationCode(userEmail);

            expect(
                SupabaseServiceMock.client.auth.signInWithOtp,
            ).toHaveBeenCalledWith({
                email: userEmail,
                options: { shouldCreateUser: false },
            });
        });
        it('should throw an error if signInWithOtp fails', async () => {
            const error = new Error('Sign-in failed');
            SupabaseServiceMock.client.auth.signInWithOtp.mockResolvedValueOnce(
                { error },
            );

            const userEmail = 'test@example.com';
            await expect(
                service.sendVerificationCode(userEmail),
            ).rejects.toThrow(error);

            expect(
                SupabaseServiceMock.client.auth.signInWithOtp,
            ).toHaveBeenCalledWith({
                email: userEmail,
                options: { shouldCreateUser: false },
            });
        });
    });
    describe('verifyVerificationCode', () => {
        it('should call verifyOtp with correct parameters', async () => {
            SupabaseServiceMock.client.auth.verifyOtp.mockResolvedValueOnce({
                error: null,
            });

            const userEmail = 'test@example.com';
            const submittedCode = '123456';
            const result = await service.verifyVerificationCode(
                userEmail,
                submittedCode,
            );

            expect(
                SupabaseServiceMock.client.auth.verifyOtp,
            ).toHaveBeenCalledWith({
                email: userEmail,
                token: submittedCode,
                type: 'email',
            });
            expect(result).toBe(true);
        });

        it('should return false if verifyOtp fails', async () => {
            const error = new Error('Verification failed');
            SupabaseServiceMock.client.auth.verifyOtp.mockResolvedValueOnce({
                error,
            });

            const userEmail = 'test@example.com';
            const submittedCode = '123456';
            const result = await service.verifyVerificationCode(
                userEmail,
                submittedCode,
            );

            expect(
                SupabaseServiceMock.client.auth.verifyOtp,
            ).toHaveBeenCalledWith({
                email: userEmail,
                token: submittedCode,
                type: 'email',
            });
            expect(result).toBe(false);
        });
    });
});
