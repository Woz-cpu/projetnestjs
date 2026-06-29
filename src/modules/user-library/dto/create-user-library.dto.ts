import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserLibraryDTO {
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsInt()
  @IsNotEmpty()
  gameId!: number;
}
