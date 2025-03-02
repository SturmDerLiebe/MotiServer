import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserDto } from './dto/register-user.input';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should not throw on correct input', () => {
            //GIVEN
            const input: RegisterUserDto = {
                username: 'TestUser',
                email: 'Test@Email.com',
                password: '1m2m3n4b5b7',
            };

            //WHEN
            const test = () => controller.register(input);

            //THEN
            expect(test).not.toThrow();
        });
    });

    describe('login', () => {
        it('should return no body', () => {
            expect(controller.login()).toBeUndefined();
        });
    });
});
