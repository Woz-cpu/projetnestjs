import { Injectable, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(user => user.id === id);
    }

    // AddUser(user: { id: number; name: string }) {
    //     this.users.push(user);
    //     console.log(`User added: ${user.name}`);
    //     return user;
    // }

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
