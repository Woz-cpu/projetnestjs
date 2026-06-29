import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePublisherDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  studioCreationDate!: string;
}
