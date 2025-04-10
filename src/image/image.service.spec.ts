import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { SupabaseService } from '../bucket/supabase.service';

describe('ImageService', () => {
    let service: ImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: SupabaseService,
                    useValue: {
                        client: {
                            storage: {
                                from: {
                                    upload: jest.fn(),
                                    createSignedUrl: jest.fn(),
                                },
                            },
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ImageService>(ImageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
