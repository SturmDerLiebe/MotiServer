import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';

@Module({
    imports: [PassportModule, VerificationModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, AuthService, LocalStrategy],
})
export class AppModule {}
