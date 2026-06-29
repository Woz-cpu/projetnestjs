import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateUserDTO) {
    return this.prisma.user.create({
      data: {
        username: dto.username.trim(),
        email: dto.email.trim().toLowerCase(),
        password: dto.password,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        roleId: dto.roleId,
        street: dto.street?.trim(),
        city: dto.city?.trim(),
        postalCode: dto.postalCode?.trim(),
        country: dto.country?.trim(),
      },
    });
  }

  async update(id: number, data: Partial<CreateUserDTO>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
