import {
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    private readonly logger = new Logger(LocalAuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = await super.canActivate(context);
        if (result instanceof Observable) {
            throw new InternalServerErrorException(
                'An Observable is not supported here',
            );
        } else {
            await super.logIn(context.switchToHttp().getRequest());
            return result;
        }
    }
}
