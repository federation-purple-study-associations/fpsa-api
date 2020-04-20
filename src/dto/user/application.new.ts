import { IsNotEmpty, IsEmail } from 'class-validator';

export class NewApplication {
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;
}
