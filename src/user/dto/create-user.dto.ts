import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
        required: true,
        type: String,
        minLength: 1,
        maxLength: 255,
        pattern: '^[a-zA-Z0-9 ]+$', // Allows alphanumeric characters and spaces
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@email.com',
        required: true,
        type: String,
        format: 'email',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // Basic email validation
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'S3cureP@ssw0rd!',
        required: true,
        type: String,
        minLength: 8,
        maxLength: 128,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
