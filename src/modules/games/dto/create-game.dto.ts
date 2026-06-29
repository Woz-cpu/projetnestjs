import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateGameDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  releaseDate!: string;

  @IsInt()
  @IsNotEmpty()
  publisherId!: number;
}
