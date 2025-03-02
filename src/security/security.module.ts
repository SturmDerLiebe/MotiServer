import { Module } from '@nestjs/common';
import { SecurityProvider } from './security.provider';

@Module({
    providers: [SecurityProvider],
})
export class SecurityModule {}
