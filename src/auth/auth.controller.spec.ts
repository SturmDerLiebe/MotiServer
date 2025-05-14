import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityProvider } from '../security/security.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';
import { RegisterUserDto } from './dto/register-user.input';

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
        it('should not throw on correct input', () => {
            // GIVEN
            const input: RegisterUserDto = {
                username: 'TestUser',
                email: 'Test@Email.com',
                password: '1m2m3n4b5b7',
            };

            // WHEN
            const test = () => controller.register(input);

            // THEN
            expect(test).not.toThrow();
        });
    });

    describe('login', () => {
        it('should return no body', () => {
            expect(controller.login()).toBeUndefined();
        });
    });
});
