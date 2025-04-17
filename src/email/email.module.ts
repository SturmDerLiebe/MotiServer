import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BucketModule } from 'src/bucket/bucket.module';

@Module({
    imports: [BucketModule],
    providers: [EmailService],
})
export class EmailModule {}
