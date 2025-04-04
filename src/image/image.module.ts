import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { BucketModule } from '../bucket/bucketModule';

@Module({
    imports: [BucketModule],
    providers: [ImageService],
})
export class ImageModule {}
