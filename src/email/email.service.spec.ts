import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { SupabaseService } from '../bucket/supabase.service';
import { SupabaseServiceMock } from '../bucket/__mock__/supabase.service';

describe('EmailService', () => {
    let service: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: SupabaseService, useValue: SupabaseServiceMock },
            ],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
