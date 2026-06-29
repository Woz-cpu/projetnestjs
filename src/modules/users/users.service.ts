import { Injectable, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersService {

    findAll() {
        return this.users;
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
    }

//     async findById(id: number, includeDeleted = false) {
//   const user = await this.prisma.user.findUnique({
//     where: { id },
//     include: {
//       company: true,
//       assignedCompanies: {
//         include: {
//           company: { select: { id: true, name: true, slug: true } },
//         },
//       },
//     },
//   });

        AddUser(dto: CreateUserDTO) {
        const newUser = {
            id: Number(dto.id),
            name: dto.name?.trim()
        }
        this.users.push(newUser);
        console.log(`User added: ${newUser.name}`);
        return newUser;
    }

    EditUser(id: number, user: { id: number; name: string }) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...user };
        }
        return this.users[index];
    }
}
