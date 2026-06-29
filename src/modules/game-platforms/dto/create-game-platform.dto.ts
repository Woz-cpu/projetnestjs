import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateGamePlatformDTO {
  @IsInt()
  @IsNotEmpty()
  gameId!: number;

  @IsInt()
  @IsNotEmpty()
  platformId!: number;
}
