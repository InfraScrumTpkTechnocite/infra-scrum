import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private configService: ConfigService,
  ) {}

  async create(role: Role): Promise<Role> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Role> => {
        return await transactionnalEntityManager.save(Role, role);
      },
    );
  }

  async update(id: string, role: Role): Promise<UpdateResult> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        return await transactionnalEntityManager.update(Role, id, role);
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(Role, id);
      },
    );
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Role[]> => {
        return await transactionnalEntityManager.find(Role);
      },
    );
  }

  async findOne(id: string): Promise<Role> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Role> => {
        return await transactionnalEntityManager.findOneBy(Role, { id });
      },
    );
  }

  async findOneByName(name: string): Promise<Role> {
    //console.log("ProjectsService - findOneByProjectname");
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
      async (transactionnalEntityManager): Promise<Role> => {
        return await transactionnalEntityManager.findOne(Role, {
          where: { name: name },
        });
      },
    );
  }

  async getOrCreate(name: string): Promise<Role> {
    return await this.rolesRepository.manager.transaction(
      this.configService.get<IsolationLevel>(
        'TYPEORM_TRANSACTION_ISOLATION_LEVEL',
      ),
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
