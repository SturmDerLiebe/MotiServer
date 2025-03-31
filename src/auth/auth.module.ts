import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SecurityModule } from '../security/security.module';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [SecurityModule],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
