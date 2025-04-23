import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { BucketModule } from '../bucket/bucket.module';

@Module({
    imports: [BucketModule],
    providers: [ImageService],
})
export class ImageModule {}
