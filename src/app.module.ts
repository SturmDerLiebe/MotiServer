import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { GroupModule } from './group/group.module';

@Module({
    imports: [PassportModule, VerificationModule, AuthModule, GroupModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
