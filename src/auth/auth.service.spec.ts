import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';

describe('AuthService', () => {
    let service: AuthService;
    const existingUser = { username: 'TestUser', password: 'TestPw' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: SecurityProvider,
                    useValue: {
                        validatePassword(_: string, password: string) {
                            return new Promise((resolve) =>
                                resolve(password === existingUser.password),
                            );
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return User Data on correct credentials', () => {
            // WHEN
            const result = service.validateUser(
                existingUser.username,
                existingUser.password,
            );

            //THEN
            void expect(result).resolves.not.toBeNull();
        });

        it('should return null on nonexistent username', () => {
            // WHEN
            const result = service.validateUser(
                'wrongUsername',
                existingUser.password,
            );

            //THEN
            void expect(result).resolves.toBeNull();
        });

        it('should return null on wrong password', () => {
            // WHEN
            const result = service.validateUser(
                existingUser.username,
                'wrongPassword',
            );

            //THEN
            void expect(result).resolves.toBeNull();
        });
    });
});
