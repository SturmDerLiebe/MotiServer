import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6) //Confirm the minlength we are using
    password: string;
}
