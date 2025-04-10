import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { SupabaseService } from '../bucket/supabase.service';

@Injectable()
export class ImageService {
    constructor(private supabaseService: SupabaseService) {}

    /**
     * @throws Error - on *any* issue while uploading the file
     * @param file
     * @param filePath - the path to save and later access the file again. Make sure the **filePath is unique**!
     */
    async uploadProgressImage(file: Blob, filePath: string) {
        await this.uploadImage(
            file,
            filePath,
            process.env.SUPA_PRIVATE_BUCKET as string,
        );
    }

    /**
     * @throws Error - on *any* issue while uploading the file
     */
    private async uploadImage(
        file: Blob,
        filePath: string,
        bucketName: string,
    ) {
        await this.supabaseService.client.storage
            .from(bucketName)
            .upload(filePath, file);
    }

    /**
     * @param filePath - the same path that was given in {@link uploadProgressImage} when saving this image.
     */
    async retrieveProgressImageUrl(filePath: string) {
        await this.retrieveImageUrl(
            filePath,
            process.env.SUPA_PRIVATE_BUCKET as string,
        );
    }

    private async retrieveImageUrl(filePath: string, bucketName: string) {
        await this.supabaseService.client.storage
            .from(bucketName)
            .createSignedUrl(
                filePath,
                parseInt(
                    process.env
                        .PRIVATE_CHAT_IMAGE_URL_EXPIRATION_SECONDS as string,
                    10,
                ),
            );
    }
}
