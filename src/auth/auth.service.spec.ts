/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Challenge } from './entities/challenge.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { RegistrationResponseJSON } from '@simplewebauthn/server/script/deps';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('@simplewebauthn/server', () => {
    const actual = jest.requireActual<typeof import('@simplewebauthn/server')>(
        '@simplewebauthn/server',
    );
    return {
        ...actual,
        verifyRegistrationResponse: jest.fn(), // Ensure the function is mocked
    };
});

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let challengeRepository: Repository<Challenge>;

    const mockUser = {
        id: BigInt('123'.toString()),
        email: 'test@example.com',
        password: 'hashed',
    } as User;
    const mockChallenge = {
        user: mockUser,
        challenge: 'random-challenge',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    } as Challenge;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: SecurityProvider,
                    useValue: {
                        validatePassword: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Challenge),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(PasskeyEntity),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config = {
                                FIDO2_RP_ID: 'motiemate.com',
                                FIDO2_ORIGIN: 'https://motiemate.com',
                                FIDO2_TIMEOUT: 60000,
                            };
                            if (key in config) {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                return config[key];
                            }
                            throw new Error(
                                `Configuration key "${key}" not found`,
                            );
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        challengeRepository = module.get<Repository<Challenge>>(
            getRepositoryToken(Challenge),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // describe('validateUser', () => {
    //     it('should return User Data on correct credentials', async () => {
    //         // Mock userRepository to return a user
    //         jest.spyOn(userRepository, 'findOne').mockImplementation(
    //             async (options) => {
    //                 const where = Array.isArray(options?.where)
    //                     ? options.where[0]
    //                     : options?.where;
    //                 if (where?.id === mockUser.id) {
    //                     return Promise.resolve(mockUser);
    //                 }
    //                 return null;
    //             },
    //         );

    //         // mock SecurityProvider to validate the password
    //         jest.spyOn(
    //             service['securityProvider'],
    //             'validatePassword',
    //         ).mockResolvedValue(true);

    //         // WHEN
    //         const result = await service.validateUser(
    //             mockUser.id.toString(),
    //             mockUser.password,
    //         );

    //         // THEN
    //         expect(userRepository.findOne).toHaveBeenCalledWith({
    //             where: { id: mockUser.id },
    //         });
    //         expect(
    //             service['securityProvider'].validatePassword,
    //         ).toHaveBeenCalledWith(mockUser.password, mockUser.password);
    //         expect(result).toEqual(mockUser);
    //     });
    // });

    describe('generateRegistrationOptions', () => {
        it('should generate registration options for a valid user', async () => {
            // return a user
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

            console.log(
                await userRepository.findOne({
                    where: { id: BigInt('123'.toString()) },
                }),
            );

            // create and save a challenge
            jest.spyOn(challengeRepository, 'create').mockReturnValue(
                mockChallenge,
            );
            jest.spyOn(challengeRepository, 'save').mockResolvedValue(
                mockChallenge,
            );

            // WHEN
            const result = await service.generateRegistrationOptions('123');

            // THEN
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { id: 123 },
            });
            expect(challengeRepository.create).toHaveBeenCalledWith({
                user: mockUser,
                challenge: expect.any(String) as string,
                expiresAt: expect.any(Date) as Date,
            });
            expect(challengeRepository.save).toHaveBeenCalledWith(
                mockChallenge,
            );
            expect(result).toEqual(mockChallenge);
        });
        it('should throw UnauthorizedException if user is not found', async () => {
            // return null
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            // WHEN & THEN
            await expect(
                service.generateRegistrationOptions('123'),
            ).rejects.toThrow(UnauthorizedException);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { id: 123 },
            });
        });
    });

    describe('verifyRegistrationResponse', () => {
        it('should return verification result on successful registration response', async () => {
            // Mock challengeRepository to return a challenge
            jest.spyOn(challengeRepository, 'findOne').mockResolvedValue(
                mockChallenge,
            );

            // Mock the verification function to return a successful result
            const mockVerificationResult = {
                verified: true,
                registrationInfo: { someInfo: 'data' },
            };
            (verifyRegistrationResponse as jest.Mock).mockResolvedValue(
                mockVerificationResult,
            );

            // Mock challengeRepository.delete
            jest.spyOn(challengeRepository, 'delete').mockResolvedValue({
                affected: 1,
                raw: {},
            });

            // Mock response
            const mockResponse = {
                id: 'test-id',
                rawId: 'raw-id',
                response: {
                    attestationObject: 'attestation-object',
                    clientDataJSON: 'client-data-json',
                },
                type: 'public-key',
            } as RegistrationResponseJSON;

            // WHEN
            const result = await service.verifyRegistrationResponse(
                mockResponse,
                mockUser.id.toString(),
            );

            // THEN
            expect(challengeRepository.findOne).toHaveBeenCalledWith({
                where: { user: { id: mockUser.id } },
            });
            expect(verifyRegistrationResponse).toHaveBeenCalledWith({
                response: mockResponse,
                expectedChallenge: mockChallenge.challenge,
                expectedOrigin: 'https://motiemate.com',
                expectedRPID: 'motiemate.com',
            });
            expect(challengeRepository.delete).toHaveBeenCalledWith(
                mockChallenge.id,
            );
            expect(result).toEqual(mockVerificationResult);
        });
    });

    // describe('generateAuthenticationOptions', () => {});

    // describe('verifyAuthenticationResponse', () => {});
});
