import { IsNotEmpty, IsNumberString, IsString} from 'class-validator';

export class CreateUserDTO {
    @IsNumberString ()
    @IsNotEmpty()
    id!: number;

    @IsString()
    @IsNotEmpty()
    name!: string;
}