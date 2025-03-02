import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    const existingUser = { username: 'TestUser', password: 'TestPw' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return true on correct credentials', () => {
            // WHEN
            const result = service.validateUser(
                existingUser.username,
                existingUser.password,
            );

            //THEN
            expect(result).toBe(true);
        });

        it('should return false on nonexistent username', () => {
            // WHEN
            const result = service.validateUser(
                'wrongUsername',
                existingUser.password,
            );

            //THEN
            expect(result).toBe(false);
        });

        it('should return false on wrong password', () => {
            // WHEN
            const result = service.validateUser(
                existingUser.username,
                'wrongPassword',
            );

            //THEN
            expect(result).toBe(false);
        });
    });
});
