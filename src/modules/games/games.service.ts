import { Injectable } from '@nestjs/common';
import { CreateGameDTO } from './dto/create-game.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(id: number) {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateGameDTO) {
    return this.prisma.game.create({
      data: {
        name: dto.name.trim(),
        releaseDate: new Date(dto.releaseDate),
        publisherId: dto.publisherId,
      },
    });
  }

  async update(id: number, data: Partial<CreateGameDTO>) {
    return this.prisma.game.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.releaseDate !== undefined && {
          releaseDate: new Date(data.releaseDate),
        }),
        ...(data.publisherId !== undefined && { publisherId: data.publisherId }),
      },
    });
  }
}
