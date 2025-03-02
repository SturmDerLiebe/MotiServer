import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { SecurityModule } from './security/security.module';

@Module({
    imports: [PassportModule, VerificationModule, AuthModule, SecurityModule],
    controllers: [AppController],
    providers: [AppService, AuthService, LocalStrategy],
})
export class AppModule {}
