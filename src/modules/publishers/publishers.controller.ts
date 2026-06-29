import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { CreatePublisherDTO } from './dto/create-publisher.dto';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get()
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publishersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePublisherDTO) {
    return this.publishersService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreatePublisherDTO>) {
    return this.publishersService.update(id, data);
  }
}
