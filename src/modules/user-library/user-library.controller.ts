import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserLibraryService } from './user-library.service';
import { CreateUserLibraryDTO } from './dto/create-user-library.dto';

@Controller('user-library')
export class UserLibraryController {
  constructor(private readonly userLibraryService: UserLibraryService) {}

  @Get()
  findAll() {
    return this.userLibraryService.findAll();
  }

  @Get(':userId/:gameId')
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.userLibraryService.findOne(userId, gameId);
  }

  @Post()
  create(@Body() dto: CreateUserLibraryDTO) {
    return this.userLibraryService.create(dto);
  }

  @Delete(':userId/:gameId')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.userLibraryService.remove(userId, gameId);
  }
}
