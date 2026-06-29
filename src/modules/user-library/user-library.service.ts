import { Injectable } from '@nestjs/common';
import { CreateUserLibraryDTO } from './dto/create-user-library.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserLibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.userLibrary.findMany();
  }

  async findOne(userId: number, gameId: number) {
    return this.prisma.userLibrary.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });
  }

  async create(dto: CreateUserLibraryDTO) {
    return this.prisma.userLibrary.create({
      data: {
        userId: dto.userId,
        gameId: dto.gameId,
      },
    });
  }

  async remove(userId: number, gameId: number) {
    return this.prisma.userLibrary.delete({
      where: { userId_gameId: { userId, gameId } },
    });
  }
}
