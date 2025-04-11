import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../bucket/supabase.service';

@Injectable()
export class EmailService {
    constructor(private supabaseService: SupabaseService) {}

    /**
     * @param userEmail
     * @throws AuthError on any issue while sending the email
     */
    async sendVerificationCode(userEmail: string): Promise<void> {
        const { error } = await this.supabaseService.client.auth.signInWithOtp({
            email: userEmail,
            options: { shouldCreateUser: false },
        });
        if (error !== null) throw error;
    }

    async verifyVerificationCode(
        userEmail: string,
        submittedCode: string,
    ): Promise<boolean> {
        const { error } = await this.supabaseService.client.auth.verifyOtp({
            email: userEmail,
            token: submittedCode,
            type: 'email',
        });
        return error === null;
    }
}
