import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryFailedExceptionFilter } from '../query-failed-exceptions.filter';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@UseFilters(new QueryFailedExceptionFilter())
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) { }

  @Post()
  async create(@Body() role: Role): Promise<Role> {
    return await this.roleService.create(role);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() role: Role,
  ): Promise<UpdateResult> {
    return await this.roleService.update(id, role);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.roleService.delete(id);
  }

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.roleService.findOne(id);
  }

  @Get('/name/:name')
  async findOneByName(@Param('name') name: string): Promise<Role> {
    return await this.roleService.findOneByName(name);
  }
}
