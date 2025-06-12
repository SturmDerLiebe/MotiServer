import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'The email address of the user',
        example: 'john.doe@email.com',
        uniqueItems: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'The password for the user account',
        example: 'S3cureP@ssw0rd!',
        minLength: 8,
        maxLength: 128,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}
