import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { RedisOptions } from 'ioredis';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.development'],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            ssl: true,
            host: process.env.PGHOST as string,
            port: parseInt(process.env.PGPORT as string, 10),
            username: process.env.PGUSER as string,
            password: process.env.PGPASSWORD as string,
            database: process.env.PGDATABASE as string,
            entities: [],
            synchronize: process.env.NODE_ENV === 'development',
            cache:
                process.env.NODE_ENV === 'development'
                    ? true
                    : {
                          type: 'ioredis',
                          options: {
                              keyPrefix: 'cache',
                              host: process.env.UPSTASH_REDIS_HOST as string,
                              password: process.env
                                  .UPSTASH_REDIS_PASSWORD as string,
                              port: parseInt(
                                  process.env.UPSTASH_REDIS_PORT as string,
                                  10,
                              ),
                              tls: {},
                          } satisfies RedisOptions,
                          ignoreErrors: process.env.NODE_ENV === 'production',
                      },
        }),
        VerificationModule,
        AuthModule,
        ImageModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
