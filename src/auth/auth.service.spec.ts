/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';

jest.mock('@simplewebauthn/server', () => ({
    generateRegistrationOptions: jest.fn(),
    verifyRegistrationResponse: jest.fn(),
    generateAuthenticationOptions: jest.fn(),
    verifyAuthenticationResponse: jest.fn(),
}));

import {
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { ConfigService } from '@nestjs/config';

const createMockRepository = () => ({
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
});

describe('AuthService', () => {
    let service: AuthService;
    let mockRepository: jest.Mocked<ReturnType<typeof createMockRepository>>;
    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'RP_ID') return 'motiemate.com';
            if (key === 'RP_NAME') return 'Motimate';
            if (key === 'RP_ORIGIN') return 'https://motiemate.com';
            return null;
        }),
    };

    beforeEach(async () => {
        mockRepository = createMockRepository();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: SecurityProvider,
                    useValue: {
                        validatePassword: jest.fn(
                            (_: string, password: string) =>
                                Promise.resolve(password === 'TestPw'),
                        ),
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

    describe('generateAuthenticationOptions', () => {
        it('should generate auth options and save challenge', async () => {
            mockRepository.findOne.mockResolvedValue({
                user_id: '123',
                email: 'test@test.com',
            });
            mockRepository.create.mockImplementation((challenge) => ({
                ...challenge,
                id: 'challenge1',
            }));
            mockRepository.save.mockResolvedValue({ id: 'challenge1' });
            (generateAuthenticationOptions as jest.Mock).mockReturnValue({
                challenge: 'testAuthChallenge',
            });

            const result = await service.generateAuthenticationOptions('123');

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { user_id: '123' },
            });
            expect(mockRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ challenge: expect.any(String) }),
            );
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toHaveProperty('challenge', 'testAuthChallenge');
        });

        it('should throw if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(
                service.generateAuthenticationOptions('unknown'),
            ).rejects.toThrow('User not found');
        });

        it('should throw if repository throws', async () => {
            mockRepository.findOne.mockRejectedValue(new Error('DB Error'));
            await expect(
                service.generateAuthenticationOptions('123'),
            ).rejects.toThrow('DB Error');
        });
    });

    describe('verifyAuthenticationResponse', () => {
        it('should verify auth response successfully', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'testChallenge',
                id: 1,
            });
            mockRepository.delete.mockResolvedValue({ affected: 1 });
            mockRepository.update.mockResolvedValue({ affected: 1 });
            (verifyAuthenticationResponse as jest.Mock).mockResolvedValue({
                verified: true,
                authenticationInfo: { newCounter: 42 },
            });

            const mockPasskey = {
                credentialID: Buffer.from('credId'),
                publicKey: 'publicKey',
                counter: 0,
            };
            mockRepository.findOne.mockResolvedValueOnce({
                challenge: 'testChallenge',
                id: 1,
            });
            mockRepository.findOne.mockResolvedValueOnce(mockPasskey);

            const response = { id: 'credId', rawId: 'rawId' };
            const result = await service.verifyAuthenticationResponse(
                response as any,
                '123',
            );

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { user: { user_id: '123' } },
            });
            expect(verifyAuthenticationResponse).toHaveBeenCalledWith(
                expect.objectContaining({ response: expect.any(Object) }),
            );
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(mockRepository.update).toHaveBeenCalledWith(
                { credentialID: Buffer.from('credId') },
                { counter: 42 },
            );
            expect(result).toEqual({
                verified: true,
                authenticationInfo: { newCounter: 42 },
            });
        });

        it('should throw if challenge not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(
                service.verifyAuthenticationResponse(
                    { id: 'id', rawId: 'rawId' } as any,
                    'user1',
                ),
            ).rejects.toThrow('Challenge not found');
        });

        it('should throw if passkey not found', async () => {
            mockRepository.findOne
                .mockResolvedValueOnce({ challenge: 'testChallenge', id: 1 })
                .mockResolvedValueOnce(null);

            await expect(
                service.verifyAuthenticationResponse(
                    { id: 'id', rawId: 'rawId' } as any,
                    'user1',
                ),
            ).rejects.toThrow('Passkey not found');
        });

        it('should throw if verification fails', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'test',
                id: 1,
            });
            mockRepository.delete.mockResolvedValue({ affected: 1 });
            (verifyAuthenticationResponse as jest.Mock).mockResolvedValue({
                verified: false,
            });
            await expect(
                service.verifyAuthenticationResponse(
                    { id: 'id', rawId: 'rawId' } as any,
                    'user1',
                ),
            ).rejects.toThrow('Authentication failed');
        });

        it('should throw if delete fails', async () => {
            mockRepository.findOne.mockResolvedValue({
                challenge: 'test',
                id: 1,
            });
            mockRepository.delete.mockRejectedValue(new Error('Delete Error'));
            (verifyAuthenticationResponse as jest.Mock).mockResolvedValue({
                verified: true,
                authenticationInfo: { newCounter: 42 },
            });
            await expect(
                service.verifyAuthenticationResponse(
                    { id: 'id', rawId: 'rawId' } as any,
                    'user1',
                ),
            ).rejects.toThrow('Delete Error');
        });
    });
});
