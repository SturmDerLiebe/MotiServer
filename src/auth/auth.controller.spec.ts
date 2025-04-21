import { Test, TestingModule } from '@nestjs/testing';
import { SecurityModule } from '../security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { RegisterUserDto } from './dto/register-user.input';
import { Challenge } from './entities/challenge.entity';
import { ChallengeDTO } from './dto/challenge.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
    AuthenticationResponseJSON,
    CredentialDeviceType,
    RegistrationResponseJSON,
} from '@simplewebauthn/server/script/deps';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const mockAuthService = {
            generateRegistrationOptions: jest.fn(),
            verifyRegistrationResponse: jest.fn(),
            generateAuthenticationOptions: jest.fn(),
            verifyAuthenticationResponse: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            imports: [SecurityModule],
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // describe('register', () => {
    //     it('should not throw on correct input', () => {
    //         //GIVEN
    //         const input: RegisterUserDto = {
    //             username: 'TestUser',
    //             email: 'Test@Email.com',
    //             password: '1m2m3n4b5b7',
    //         };

    //         //WHEN
    //         const test = () => controller.register(input);

    //         //THEN
    //         expect(test).not.toThrow();
    //     });
    // });

    describe('login', () => {
        it('should return no body', () => {
            expect(controller.login()).toBeUndefined();
        });
    });
    describe('webauthnRegister', () => {
        it('should return a ChallengeDTO when registration options are generated successfully', async () => {
            //given
            const userId = '12321';

            const mockChallenge: Challenge = {
                id: 'challenge-id',
                challenge: 'random-challenge-string',
                expiresAt: new Date(),
                createdAt: new Date(),
                user: {
                    id: BigInt('1'.toString()),
                    email: 'test@test.com',
                    password: 'hashed',
                    passkeys: [],
                    challenges: [],
                },
            };
            jest.spyOn(
                authService,
                'generateRegistrationOptions',
            ).mockResolvedValue(mockChallenge);

            //when
            const result = await controller.webauthnRegister(userId);

            //then
            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.generateRegistrationOptions,
            ).toHaveBeenCalledWith(userId);

            expect(result).toBeInstanceOf(ChallengeDTO);
            expect(result.challenge).toBe(mockChallenge.challenge);
            expect(result.expiresAt).toBe(mockChallenge.expiresAt);
        });

        it('should throw BadRequestException when generating registration options fails', async () => {
            const userId = '12321';
            (
                authService.generateRegistrationOptions as jest.Mock
            ).mockRejectedValue(
                new Error('Error generating registration options'),
            );

            // when then
            await expect(controller.webauthnRegister(userId)).rejects.toThrow(
                BadRequestException,
            );

            // then
            // expect(
            //     // eslint-disable-next-line @typescript-eslint/unbound-method
            //     authService.generateRegistrationOptions,
            // ).toHaveBeenCalledWith(userId);
        });
    });

    describe('webauthnRegisterVerify', () => {
        it('should return verification when registration response is verified successfully', async () => {
            const userId = '12321';
            const response = {
                id: 'test-id',
                rawId: 'raw-id',
                response: {
                    attestationObject: 'attestation-object',
                    clientDataJSON: 'client-data-json',
                },
                type: 'public-key',
            } as RegistrationResponseJSON;

            const mockVerification = { verified: true };
            jest.spyOn(
                authService,
                'verifyRegistrationResponse',
            ).mockResolvedValue(mockVerification);

            // WHEN
            const result = await controller.webauthnRegisterVerify(
                response,
                userId,
            );

            // THEN
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(authService.verifyRegistrationResponse).toHaveBeenCalledWith(
                response,
                userId,
            );
            expect(result).toEqual({ verification: mockVerification });
        });

        it('should throw UnauthorizedException when verifying registration response fails', async () => {
            const userId = '12321';
            const response = {
                id: 'test-id',
                rawId: 'raw-id',
                response: {
                    attestationObject: 'attestation-object',
                    clientDataJSON: 'client-data-json',
                },
                type: 'public-key',
            } as RegistrationResponseJSON;

            (
                authService.verifyRegistrationResponse as jest.Mock
            ).mockRejectedValue(
                new Error('Error verifying registration response'),
            );

            await expect(
                controller.webauthnRegisterVerify(response, userId),
            ).rejects.toThrow(UnauthorizedException);

            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.verifyRegistrationResponse,
            ).toHaveBeenCalledWith(response, userId);
        });
    });

    describe('webauthnAuthenticate', () => {
        it('should return a ChallengeDTO when authentication options are generated successfully', async () => {
            const userId = '12321';
            const mockChallenge: Challenge = {
                id: 'challenge-id',
                challenge: 'random-challenge-string',
                expiresAt: new Date(),
                createdAt: new Date(),
                user: {
                    id: BigInt('1'.toString()),
                    email: 'test@test.com',
                    password: 'hashed',
                    passkeys: [],
                    challenges: [],
                },
            };
            (
                authService.generateAuthenticationOptions as jest.Mock
            ).mockResolvedValue(mockChallenge);
            // when
            const result = await controller.webauthnAuthenticate(userId);
            // then
            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.generateAuthenticationOptions,
            ).toHaveBeenCalledWith(userId);
            expect(result).toBeInstanceOf(ChallengeDTO);
            expect(result.challenge).toBe(mockChallenge.challenge);
            expect(result.expiresAt).toBe(mockChallenge.expiresAt);
        });
        it('should throw BadRequestException when generating authentication options fails', async () => {
            const userId = '12321';

            jest.spyOn(
                authService,
                'generateAuthenticationOptions',
            ).mockRejectedValue(
                new Error('Error generating authentication options'),
            );
            // when then
            await expect(
                controller.webauthnAuthenticate(userId),
            ).rejects.toThrow(BadRequestException);
            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.generateAuthenticationOptions,
            ).toHaveBeenCalledWith(userId);
        });
    });

    describe('webauthnAuthenticateVerify', () => {
        it('should return verification when authentication response is verified successfully', async () => {
            const userId = '12321';
            const response = {
                id: 'test-id',
                rawId: 'raw-id',
                response: {
                    clientDataJSON: 'client-data-json',
                    authenticatorData: 'authenticator-data',
                    signature: 'signature',
                    credentialID: 'credential-id',
                    userHandle: 'user-handle',
                },
                clientExtensionResults: {},
                type: 'public-key',
            } as AuthenticationResponseJSON;

            const mockVerification = {
                verified: true,
                authenticationInfo: {
                    credentialID: new Uint8Array([1, 2, 3, 4]), // example
                    newCounter: 1,
                    userVerified: true,
                    credentialDeviceType:
                        'singleDevice' as CredentialDeviceType,
                    credentialBackedUp: false,
                    origin: 'https://motie.com',
                    rpID: 'motiemate.com',
                    authenticatorExtensionResults: {}, // optional
                },
            };

            jest.spyOn(
                authService,
                'verifyAuthenticationResponse',
            ).mockResolvedValue(mockVerification);
            // WHEN
            const result = await controller.webauthnAuthenticateVerify(
                response,
                userId,
            );
            // THEN
            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.verifyAuthenticationResponse,
            ).toHaveBeenCalledWith(response, userId);
            expect(result).toEqual({ verification: mockVerification });
        });
        it('should throw UnauthorizedException when verifying authentication response fails', async () => {
            const userId = '12321';
            const response = {
                id: 'test-id',
                rawId: 'raw-id',
                response: {
                    authenticatorData: 'authenticator-data',
                    clientDataJSON: 'client-data-json',
                    signature: 'signature',
                    userHandle: 'user-handle',
                },
                type: 'public-key',
            } as AuthenticationResponseJSON;
            (
                authService.verifyAuthenticationResponse as jest.Mock
            ).mockRejectedValue(
                new Error('Error verifying authentication response'),
            );
            // when then
            await expect(
                controller.webauthnAuthenticateVerify(response, userId),
            ).rejects.toThrow(UnauthorizedException);
            expect(
                // eslint-disable-next-line @typescript-eslint/unbound-method
                authService.verifyAuthenticationResponse,
            ).toHaveBeenCalledWith(response, userId);
        });
    });
});
