import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    //On injecte le service UsersService dans le contrôleur UsersController via le constructeur. Cela permet au contrôleur d'accéder aux méthodes du service pour gérer les utilisateurs.
constructor(private readonly UsersService: UsersService) {}

    @Get()
    findAll() {
        //Cette méthode est un gestionnaire de route pour la requête GET sur l'URL /users. Elle utilise le service UsersService pour récupérer tous les utilisateurs et les renvoyer en réponse.
        return this.UsersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        //Cette méthode est un gestionnaire de route pour la requête GET sur l'URL /users/:id. Elle utilise le service UsersService pour récupérer un utilisateur spécifique en fonction de l'identifiant fourni dans l'URL.
        return this.UsersService.findOne(id);
    }

    @Post('create')
    AddUser(@Body() user: { id: number; name: string }) {
        //Cette méthode est un gestionnaire de route pour la requête POST sur l'URL /users. Elle utilise le service UsersService pour ajouter un nouvel utilisateur en fonction des données fournies dans le corps de la requête.
        return this.UsersService.AddUser(user);
    }

    @Put('edit/:id')
    EditUser(@Param('id') id: number, @Body() user: { id: number; name: string }) {
        //Cette méthode est un gestionnaire de route pour la requête PUT sur l'URL /users/edit/:id. Elle utilise le service UsersService pour modifier un utilisateur spécifique en fonction de l'identifiant fourni dans l'URL et des données fournies dans le corps de la requête.
        return this.UsersService.EditUser(id, user);
    }

    @Post('create-dto')
    CreateUserDTO(@Body() user: CreateUserDTO) {
        //Cette méthode est un gestionnaire de route pour la requête POST sur l'URL /users. Elle utilise le service UsersService pour ajouter un nouvel utilisateur en fonction des données fournies dans le corps de la requête.
        return this.UsersService.AddUser(user);
    }
}
