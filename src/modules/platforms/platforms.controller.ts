import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDTO } from './dto/create-platform.dto';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platformsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePlatformDTO) {
    return this.platformsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreatePlatformDTO>) {
    return this.platformsService.update(id, data);
  }
}
