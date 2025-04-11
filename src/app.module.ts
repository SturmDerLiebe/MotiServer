import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.development'],
        }),
        VerificationModule,
        AuthModule,
        ImageModule,
        EmailModule,
        PassportModule,
        GroupModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
