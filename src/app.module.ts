import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { GamesModule } from './modules/games/games.module';
import { MailModule } from './modules/mail/mail.module';
import { CacheModule } from './modules/cache/cache.module';
import { QueueModule } from './modules/queue/queue.module';
import { DemoModule } from './modules/demo/demo.module';

@Module({
  imports: [
    // Configuration globale (charge les .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Accès base de données (Prisma)
    PrismaModule,
    // Modules métier
    UsersModule,
    RolesModule,
    GamesModule,
    // Modules infrastructure
    MailModule,
    CacheModule,
    QueueModule,
    // Module de démonstration
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
