import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
    let service: AuthService;
    const existingUser = { username: 'TestUser', password: 'TestPw' };

    const mockRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
        })),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            const envVariables = {
                RP_ID: 'motiemate.com',
                RP_NAME: 'Motimate',
                RP_ORIGIN: 'https://motiemate.com',
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return envVariables[key];
        }),
    };

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
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(PasskeyEntity),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(Challenge),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return User Data on correct credentials', async () => {
            // Mock the repository to return a user
            mockRepository.findOne.mockResolvedValue(existingUser);

            // WHEN
            const result = service.validateUser(
                existingUser.username,
                existingUser.password,
            );

            // THEN
            await expect(result).resolves.not.toBeNull();
        });

        it('should return null on nonexistent username', async () => {
            // Mock the repository to return null
            mockRepository.findOne.mockResolvedValue(null);

            // WHEN
            const result = service.validateUser(
                'wrongUsername',
                existingUser.password,
            );

            // THEN
            await expect(result).resolves.toBeNull();
        });

        it('should return null on wrong password', async () => {
            // Mock the repository to return a user
            mockRepository.findOne.mockResolvedValue(existingUser);

            // WHEN
            const result = service.validateUser(
                existingUser.username,
                'wrongPassword',
            );

            // THEN
            await expect(result).resolves.toBeNull();
        });
    });
});
