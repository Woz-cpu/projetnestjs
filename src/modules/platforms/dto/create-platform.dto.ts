import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlatformDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
