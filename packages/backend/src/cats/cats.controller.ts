import { Controller, Get, Req, Post, HttpCode, Header, Redirect, Param, Body } from '@nestjs/common';
import { Request } from 'express';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
  //@Post()
  //@HttpCode(204)
  //@Header('Cache-Control', 'none')
  // create(): string {
  //   return 'This action adds a new cat';
  // }

  @Get()
  //@Redirect('https://nestjs.com', 301)
  findAll(@Req() request: Request): string {
    //console.log('Request query = ' + request.query);
    return 'This action returns all cats';
  }


  @Get(':id')
  //findOne(@Param() params): string {
  findOne(@Param('id') id: string): string {
  //  console.log(params.id);
    console.log(id);
    //return `This action returns a #${params.id} cat`;
    return `This action returns a #${id} cat`;
  }


  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    //console.log(createCatDto);
    return `(POST @body) This action adds a new cat ${createCatDto.age}`;
  }

}
