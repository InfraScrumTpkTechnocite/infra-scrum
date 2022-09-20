import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(role: Role): Promise<Role> {
    return await this.rolesRepository.save(role);
  }

  async update(id: string, role: Role): Promise<UpdateResult> {
    return await this.rolesRepository.update(id, role);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.rolesRepository.delete(id);
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    return await this.rolesRepository.findOneBy({ id });
  }

  async findOneByName(rolename: string): Promise<Role> {
    //console.log("ProjectsService - findOneByProjectname");
    return await this.rolesRepository.findOneBy({ name: rolename });
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
