import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [VerificationModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
