import { Injectable } from '@nestjs/common';
import { CreatePlatformDTO } from './dto/create-platform.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.platform.findMany();
  }

  async findOne(id: number) {
    return this.prisma.platform.findUnique({
      where: { id },
    });
  }

  async create(dto: CreatePlatformDTO) {
    return this.prisma.platform.create({
      data: {
        name: dto.name.trim(),
      },
    });
  }

  async update(id: number, data: Partial<CreatePlatformDTO>) {
    return this.prisma.platform.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
      },
    });
  }
}
