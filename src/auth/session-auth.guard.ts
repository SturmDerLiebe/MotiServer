import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class SessionAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        if (
            // Should Skip Public Endpoints
            this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
        ) {
            return true;
        } else {
            const request: Request = context.switchToHttp().getRequest();
            return request.isAuthenticated();
        }
    }
}
