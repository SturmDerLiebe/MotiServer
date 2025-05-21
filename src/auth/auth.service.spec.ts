import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';
import { ConfigService } from '@nestjs/config';

jest.mock('@simplewebauthn/server', () => ({
    generateRegistrationOptions: jest.fn(),
    verifyRegistrationResponse: jest.fn(),
    generateAuthenticationOptions: jest.fn(),
    verifyAuthenticationResponse: jest.fn(),
}));

import {
    verifyRegistrationResponse,
    generateRegistrationOptions,
} from '@simplewebauthn/server';

describe('AuthService', () => {
    let service: AuthService;
    const existingUser = { username: 'TestUser', password: 'TestPw' };

    const mockRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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

    describe('createUser', () => {
        it('should hash the password and save the user', async () => {
            mockRepository.create = jest
                .fn()
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                .mockImplementation((user) => user);
            mockRepository.save.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
            });

            // await
            const result = await service.createUser(
                'test@example.com',
                'password123',
            );

            // then
            expect(mockRepository.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                password: expect.any(String),
            });
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, email: 'test@example.com' });
        });
        it('should throw an error if the repository throws an expection', async () => {
            mockRepository.save.mockRejectedValue(new Error('Database Error'));

            // when
            const result = service.createUser(
                'test@example.com',
                'password123',
            );

            //then
            await expect(result).rejects.toThrow('Database Error');
        });
    });

    describe('changePassword', () => {
        it('should hash the new password and update the user', async () => {
            mockRepository.update.mockResolvedValue({ affected: 1 });

            // when
            await service.changePassword(1, 'newPassword123');

            // then
            expect(mockRepository.update).toHaveBeenCalledWith(1, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                password: expect.any(String),
            });
        });

        it('should throw and error if the repository throws an exception', async () => {
            mockRepository.update.mockRejectedValue(
                new Error('Database Error'),
            );

            // when
            const result = service.changePassword(1, 'newPassword123');

            // then
            await expect(result).rejects.toThrow('Database Error');
        });
    });

    describe('generateRegistrationOptions', () => {
        it('should generate registration options and save the challenge', async () => {
            mockRepository.findOne.mockResolvedValue({
                user_id: '1',
                email: 'test@example.com',
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            mockRepository.create.mockImplementation((challenge) => ({
                ...challenge,
                id: '1',
            }));
            mockRepository.save.mockResolvedValue({
                id: '1',
            });

            (generateRegistrationOptions as jest.Mock).mockReturnValue({
                challenge: 'testChallenge',
            });

            // WHEN
            const result = await service.generateRegistrationOptions('1');

            // THEN
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { user_id: '1' },
            });
            expect(mockRepository.create).toHaveBeenCalledWith({
                user: { user_id: '1', email: 'test@example.com' },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                challenge: expect.any(String),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                expiresAt: expect.any(Date),
            });
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual(expect.any(Object));
        });

        it('should throw an error if the user is not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            // WHEN
            const result = service.generateRegistrationOptions('1');

            // THEN
            await expect(result).rejects.toThrow('User not found');
        });

        it('should throw an error if the repository throws an exception', async () => {
            mockRepository.findOne.mockRejectedValue(
                new Error('Database Error'),
            );

            // WHEN
            const result = service.generateRegistrationOptions('1');

            // THEN
            await expect(result).rejects.toThrow('Database Error');
        });
    });

    describe('verifyRegistrationResponse', () => {
        it('should verify the registration response and delete the challenge', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'testChallenge',
                id: 1,
            });
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            const mockVerification = { verified: true };
            (verifyRegistrationResponse as jest.Mock).mockResolvedValue(
                mockVerification,
            );

            // WHEN
            const result = await service.verifyRegistrationResponse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                { id: 'testId' } as any,
                '1',
            );

            // THEN
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { user: { user_id: '1' } },
            });
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockVerification);
        });
        it('should throw an error if the challenge is not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = service.verifyRegistrationResponse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                { id: 'testId' } as any,
                '1',
            );

            await expect(result).rejects.toThrow('Challenge not found');
        });

        it('should throw an error if deleting the challenge fails', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'testChallenge',
                id: 1,
            });

            (verifyRegistrationResponse as jest.Mock).mockResolvedValue({
                verified: true,
            });

            mockRepository.delete.mockRejectedValue(
                new Error('Database Error'),
            );

            const result = service.verifyRegistrationResponse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                { id: 'testId' } as any,
                '1',
            );

            await expect(result).rejects.toThrow('Database Error');
        });
        it('should throw an error if required environment variables are missing', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'testChallenge',
                id: 1,
            });

            mockConfigService.get.mockImplementation((key: string) => {
                const envVariables = {
                    RP_ORIGIN: 'testOrigin',
                };
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return envVariables[key];
            });

            const mockVerification = { verified: true };
            (verifyRegistrationResponse as jest.Mock).mockResolvedValue(
                mockVerification,
            );

            const result = service.verifyRegistrationResponse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                { id: 'testId' } as any,
                '1',
            );

            await expect(result).rejects.toThrow(
                'Environment variable RP_ID is not set',
            );
        });
    });
});
