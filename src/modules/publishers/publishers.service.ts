import { Injectable } from '@nestjs/common';
import { CreatePublisherDTO } from './dto/create-publisher.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublishersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.publisher.findMany();
  }

  async findOne(id: number) {
    return this.prisma.publisher.findUnique({
      where: { id },
    });
  }

  async create(dto: CreatePublisherDTO) {
    return this.prisma.publisher.create({
      data: {
        name: dto.name.trim(),
        studioCreationDate: new Date(dto.studioCreationDate),
      },
    });
  }

  async update(id: number, data: Partial<CreatePublisherDTO>) {
    return this.prisma.publisher.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.studioCreationDate !== undefined && {
          studioCreationDate: new Date(data.studioCreationDate),
        }),
      },
    });
  }
}
