import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GamePlatformsService } from './game-platforms.service';
import { CreateGamePlatformDTO } from './dto/create-game-platform.dto';

@Controller('game-platforms')
export class GamePlatformsController {
  constructor(private readonly gamePlatformsService: GamePlatformsService) {}

  @Get()
  findAll() {
    return this.gamePlatformsService.findAll();
  }

  @Get(':gameId/:platformId')
  findOne(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('platformId', ParseIntPipe) platformId: number,
  ) {
    return this.gamePlatformsService.findOne(gameId, platformId);
  }

  @Post()
  create(@Body() dto: CreateGamePlatformDTO) {
    return this.gamePlatformsService.create(dto);
  }

  @Delete(':gameId/:platformId')
  remove(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('platformId', ParseIntPipe) platformId: number,
  ) {
    return this.gamePlatformsService.remove(gameId, platformId);
  }
}
