import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
    client: SupabaseClient<any, 'public', any>;

    constructor(private configService: ConfigService) {
        this.client = createClient(
            this.configService.get<string>('SUPA_PROJECT_URL')!,
            this.configService.get<string>('SUPA_SECRET_API_KEY')!,
        );
    }
}
