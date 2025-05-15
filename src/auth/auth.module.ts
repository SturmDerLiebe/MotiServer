import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityModule } from '../security/security.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session-serializer.provider';
import { APP_GUARD } from '@nestjs/core';
import { SessionAuthGuard } from './session-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Fido2Strategy } from './fido2.strategy';
import { PasskeyEntity } from './entities/passkey.entity';
import { Challenge } from './entities/challenge.entity';

@Module({
    imports: [
        SecurityModule,
        PassportModule.register({ session: true }),
        TypeOrmModule.forFeature([User, PasskeyEntity, Challenge]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        Fido2Strategy,
        SessionSerializer,
        { provide: APP_GUARD, useClass: SessionAuthGuard },
    ],
})
export class AuthModule {}
