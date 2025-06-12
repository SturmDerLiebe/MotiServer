import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as process from 'node:process';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import * as passport from 'passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

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
                              process.env.UPSTASH_REDIS_SESSION_URL as string,
                          ),
                      }),
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // Swagger API documentation setup
    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('MotiMate API')
            .setDescription('API documentation for the MotiMate backend')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                    description: 'Enter your JWT token here',
                },
                'access-token',
            )
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
    }

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
