import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { SecurityModule } from '../security/security.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session-serializer.provider';
import { APP_GUARD } from '@nestjs/core';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
    imports: [SecurityModule, TypeOrmModule.forFeature([User]), PassportModule.register({ session: true })],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        SessionSerializer,
        { provide: APP_GUARD, useClass: SessionAuthGuard },
    ],
})
export class AuthModule {}
