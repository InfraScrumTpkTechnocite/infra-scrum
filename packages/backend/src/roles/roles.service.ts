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

  async findOneByName(name: string): Promise<Role> {
    //console.log("ProjectsService - findOneByProjectname");
    return await this.rolesRepository.findOne({ where: { name: name } });
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }

  async getOrCreate(name: string): Promise<Role> {
    return this.rolesRepository.manager.transaction(
      (transactionnalEntityManager): Promise<Role> => {
        return transactionnalEntityManager
          .createQueryBuilder(Role, 'role')
          .setLock('pessimistic_read')
          .where({ name })
          .getOne()
          .then(async (result) => {
            let role = result;
            if (undefined === role) {
              role = new Role();
              role.name = name;
              return await transactionnalEntityManager.save(Role, role);
            }
            return role;
          });
      },
    );
  }
}
