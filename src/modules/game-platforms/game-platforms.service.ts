import { Injectable } from '@nestjs/common';
import { CreateGamePlatformDTO } from './dto/create-game-platform.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamePlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.gamePlatform.findMany();
  }

  async findOne(gameId: number, platformId: number) {
    return this.prisma.gamePlatform.findUnique({
      where: { gameId_platformId: { gameId, platformId } },
    });
  }

  async create(dto: CreateGamePlatformDTO) {
    return this.prisma.gamePlatform.create({
      data: {
        gameId: dto.gameId,
        platformId: dto.platformId,
      },
    });
  }

  async remove(gameId: number, platformId: number) {
    return this.prisma.gamePlatform.delete({
      where: { gameId_platformId: { gameId, platformId } },
    });
  }
}
