import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Project } from 'src/projects/project.entity';
import { readFile, unlink } from 'fs';
import { Observable } from 'rxjs';

@UseFilters(new QueryFailedExceptionFilter())
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<UpdateResult> {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.delete(id);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('/username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<User> {
    return await this.userService.findOneByUsername(username);
  }

  @Post('/select')
  async select(@Body() select: any) {
    return await this.userService.select(select);
  }
}

