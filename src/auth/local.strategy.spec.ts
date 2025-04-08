import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthServiceMock } from './__mock__/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
    let localStrategy: LocalStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                { provide: AuthService, useValue: AuthServiceMock },
            ],
        }).compile();

        localStrategy = module.get(LocalStrategy);
    });

    it('should be defined', () => {
        expect(localStrategy).toBeDefined();
    });

    describe('validate', () => {
        it('should throw UnauthorizedException on invalid result from AuthService', () => {
            //WHEN
            const testFn = () =>
                localStrategy.validate('WrongUsername', 'WrongPassword');

            //THEN
            void expect(testFn).rejects.toThrow(UnauthorizedException);
        });
    });
});
