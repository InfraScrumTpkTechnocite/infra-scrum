import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { hash } from 'bcrypt';
//import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, //private mailService: MailService
  ) {}

  async create(user: User): Promise<User> {
    user.password = await hash(user.password, 10);
    // const token = Math.floor(1000 + Math.random() * 9000).toString();
    // user.token = token;
    // await this.mailService.sendUserConfirmation(user, token);
    // return await this.usersRepository.save(user);
    console.log(
      'backend - users.service - create - user to create = ' +
        JSON.stringify(user),
    );
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<User> => {
        return await transactionnalEntityManager.save(User, user);
      },
    );
  }

  async update(id: string, user: User): Promise<UpdateResult> {
    if (user.password) user.password = await hash(user.password, 10);
    //return await this.usersRepository.update(id, user);
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<UpdateResult> => {
        console.log(`users.services - update - user = ${JSON.stringify(user)}`);
        return await transactionnalEntityManager.update(
          User,
          { id: id },
          {
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
            role: user.role,
            picture: user.picture,
          },
        );
      },
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    //return await this.usersRepository.delete(id);
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<DeleteResult> => {
        return await transactionnalEntityManager.delete(User, id);
      },
    );
  }

  async findAll(): Promise<User[]> {
    // const users: User[] = await this.usersRepository.find({
    //   relations: ['role'],
    // });
    // users.forEach((user) => {
    //   console.log(`users.controller - findAll - user = ${user.role.id}`);
    // });
    // return users;
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<User[]> => {
        return await transactionnalEntityManager.find(User, {
          relations: ['role'],
        });
      },
    );
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<User> => {
        return await transactionnalEntityManager.findOne(User, {
          where: {
            id: id,
          },
          relations: {
            role: true,
          },
        });
      },
    );
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<User> => {
        return await transactionnalEntityManager.findOne(User, {
          relations: { role: true },
          where: { username },
        });
      },
    );
  }

  async select(select: any): Promise<any> {
    return await this.usersRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionnalEntityManager): Promise<User[]> => {
        return await transactionnalEntityManager.query(select.select);
      },
    );
  }
}
