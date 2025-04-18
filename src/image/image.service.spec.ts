import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { SupabaseService } from '../bucket/supabase.service';
import { SupabaseServiceMock } from '../bucket/__mock__/supabase.service';

describe('ImageService', () => {
    let service: ImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: SupabaseService,
                    useValue: SupabaseServiceMock,
                },
            ],
        }).compile();

        service = module.get<ImageService>(ImageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
