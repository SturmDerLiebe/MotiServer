import { Test, TestingModule } from '@nestjs/testing';
import { SecurityModule } from '../security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SecurityModule],
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
