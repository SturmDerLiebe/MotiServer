import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as process from 'node:process';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        session({
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: false,
            store:
                (process.env.NODE_ENV as string) === 'development'
                    ? undefined
                    : new RedisStore({
                          client: new Redis(
                              process.env.UPSTASH_SESSION_REDIS_URL as string,
                          ),
                      }),
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
