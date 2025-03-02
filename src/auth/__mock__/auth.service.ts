import type { AuthService } from '../auth.service';

export const AuthServiceMock: AuthService = { validateUser: () => false };
