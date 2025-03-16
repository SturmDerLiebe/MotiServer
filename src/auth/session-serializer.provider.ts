import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

export class TempUserEntity {
    id: string;
}

interface SerializedUserDTO {
    id: string;
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(
        user: TempUserEntity,
        done: (err: Error | null, payload: SerializedUserDTO) => void,
    ): void {
        done(null, { id: user.id });
    }

    deserializeUser(
        payload: SerializedUserDTO,
        done: (err: Error | null, user: SerializedUserDTO) => void,
    ): any {
        done(null, payload);
    }
}
