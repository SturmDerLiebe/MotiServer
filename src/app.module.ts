import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.development'],
        }),
        VerificationModule,
        AuthModule,
        ImageModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
