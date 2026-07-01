import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username.trim() },
    });

    // L'utilisateur n'existe pas.
    if (!user) {
      throw new UnauthorizedException(
        'erreur : cet utilisateur n\'existe pas',
      );
    }

    // L'utilisateur existe mais le mot de passe est incorrect.
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('erreur : mot de passe incorrect');
    }

    // Identifiants valides : on renvoie le nom à afficher.
    return { lastName: user.lastName };
  }
}
