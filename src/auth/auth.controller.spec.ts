/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.input';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ChallengeDTO } from './dto/challenge.dto';
import {
    AuthenticationResponseJSON,
    RegistrationResponseJSON,
} from '@simplewebauthn/server/script/deps';
import { VerifiedAuthenticationResponse } from '@simplewebauthn/server';

describe('AuthController', () => {
    let controller: AuthController;

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
            return envVariables[key] as unknown;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: SecurityProvider,
                    useValue: {
                        validatePassword: jest.fn(),
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

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should register a user successfully', async () => {
            const mockUser = {
                user_id: '1',
                name: 'TestUser',
                email: 'test@example.com',
                password: 'hashedPassword123',
            } as jest.Mocked<User>;

            const createUserSpy = jest
                .spyOn(controller['authService'], 'createUser')
                .mockResolvedValue(mockUser);

            const input: RegisterUserDto = {
                username: 'TestUser',
                email: 'test@example.com',
                password: 'password123',
            };

            const result = await controller.register(input);

            expect(createUserSpy).toHaveBeenCalledWith(
                input.username,
                input.password,
            );
            expect(result).toEqual({
                message: 'User registered successfully',
                user: mockUser,
            });
        });

        it('should not throw on correct input', async () => {
            // GIVEN
            const input: RegisterUserDto = {
                username: 'TestUser',
                email: 'Test@Email.com',
                password: '1m2m3n4b5b7',
            };

            jest.spyOn(
                controller['authService'],
                'createUser',
            ).mockResolvedValue({} as User);

            // WHEN & THEN
            await expect(controller.register(input)).resolves.not.toThrow();
        });
    });

    describe('login', () => {
        it('should return no body', () => {
            expect(controller.login()).toBeUndefined();
        });
    });

    describe('logout', () => {
        it('should call request.logout', () => {
            const mockRequest = {
                logout: jest.fn((callback: () => void): void => {
                    callback();
                }),
            };

            controller.logout(mockRequest as any);

            expect(mockRequest.logout).toHaveBeenCalled();
        });
    });
    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const spy = jest
                .spyOn(controller['authService'], 'changePassword')
                .mockResolvedValue(undefined);
            const userId = 1;
            const newPassword = 'newPassword123';

            const result = await controller.changePassword(userId, newPassword);

            expect(spy).toHaveBeenCalledWith(userId, newPassword);
            expect(result).toEqual({
                message: 'Password changed successfully',
            });
        });

        it('should throw BadRequestException when changePassword fails', async () => {
            const userId = 1;
            const newPassword = 'newPassword123';

            await expect(
                controller.changePassword(userId, newPassword),
            ).rejects.toThrow(BadRequestException);
        });
    });
    describe('webauthnRegister', () => {
        it('should generate registration options successfully', async () => {
            const mockChallenge = {
                challenge: 'test-challenge',
                user: { id: 'user-id' },
            } as unknown as jest.Mocked<Challenge>;
            const spy = jest
                .spyOn(controller['authService'], 'generateRegistrationOptions')
                .mockResolvedValue(mockChallenge);
            const userId = 'user-id';

            const result = await controller.webauthnRegister(userId);

            expect(spy).toHaveBeenCalledWith(userId);
            expect(result).toBeInstanceOf(ChallengeDTO);
            expect(result).toEqual(new ChallengeDTO(mockChallenge));
        });

        it('should throw BadRequestException when generateRegistrationOptions fails', async () => {
            const userId = 'user-id';

            await expect(controller.webauthnRegister(userId)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
    describe('webauthnRegisterVerify', () => {
        it('should verify registration response successfully', async () => {
            const mockResponse = {
                id: 'credential-id',
            } as RegistrationResponseJSON;
            const mockVerification = { verified: true };
            const spy = jest
                .spyOn(controller['authService'], 'verifyRegistrationResponse')
                .mockResolvedValue(mockVerification);
            const userId = 'user-id';

            const result = await controller.webauthnRegisterVerify(
                mockResponse,
                userId,
            );

            expect(spy).toHaveBeenCalledWith(mockResponse, userId);
            expect(result).toEqual({ verification: mockVerification });
        });

        it('should throw UnauthorizedException when verifyRegistrationResponse fails', async () => {
            const mockResponse = {
                id: 'credential-id',
            } as RegistrationResponseJSON;
            const userId = 'user-id';

            await expect(
                controller.webauthnRegisterVerify(mockResponse, userId),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
    describe('webauthnAuthenticate', () => {
        it('should generate authentication options successfully', async () => {
            const mockChallenge = {
                challenge: 'test-challenge',
            } as unknown as jest.Mocked<Challenge>;
            const spy = jest
                .spyOn(
                    controller['authService'],
                    'generateAuthenticationOptions',
                )
                .mockResolvedValue(mockChallenge);
            const userId = 'user-id';

            const result = await controller.webauthnAuthenticate(userId);

            expect(spy).toHaveBeenCalledWith(userId);
            expect(result).toBeInstanceOf(ChallengeDTO);
            expect(result).toEqual(new ChallengeDTO(mockChallenge));
        });

        it('should throw BadRequestException when generateAuthenticationOptions fails', async () => {
            const userId = 'user-id';

            await expect(
                controller.webauthnAuthenticate(userId),
            ).rejects.toThrow(BadRequestException);
        });
    });
    describe('webauthnAuthenticateVerify', () => {
        it('should verify authentication response successfully', async () => {
            const mockResponse = {
                id: 'credential-id',
            } as AuthenticationResponseJSON;
            const mockVerification = {
                verified: true,
            } as VerifiedAuthenticationResponse;
            const spy = jest
                .spyOn(
                    controller['authService'],
                    'verifyAuthenticationResponse',
                )
                .mockResolvedValue(mockVerification);
            const userId = 'user-id';

            const result = await controller.webauthnAuthenticateVerify(
                mockResponse,
                userId,
            );

            expect(spy).toHaveBeenCalledWith(mockResponse, userId);
            expect(result).toEqual({ verification: mockVerification });
        });

        it('should throw UnauthorizedException when verifyAuthenticationResponse fails', async () => {
            const mockResponse = {
                id: 'credential-id',
            } as AuthenticationResponseJSON;
            const userId = 'user-id';

            await expect(
                controller.webauthnAuthenticateVerify(mockResponse, userId),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
