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
      async (transactionnalEntityManager): Promise<User> => {
        return transactionnalEntityManager
          .createQueryBuilder(User, 'user')
          .setLock('pessimistic_read')
          .where({ username: Equal(user.username) })
          .getOne()
          .then(async (result) => {
            let newuser: User = result;
            console.log(
              `users.service - create - newuser = ${JSON.stringify(newuser)}`,
            );
            if (undefined == newuser) {
              console.log(
                `users.service - create - newuser = ${JSON.stringify(user)}`,
              );
              newuser = user;
              delete newuser.id;
              return await transactionnalEntityManager.save(User, newuser);
            }
            return newuser;
          });
      },
    );
  }

  async update(id: string, user: User): Promise<UpdateResult> {
    if (user.password) user.password = await hash(user.password, 10);
    return await this.usersRepository.update(id, user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    // const users: User[] = await this.usersRepository.find({
    //   relations: ['role'],
    // });
    // users.forEach((user) => {
    //   console.log(`users.controller - findAll - user = ${user.role.id}`);
    // });
    // return users;
    return await this.usersRepository.find({ relations: ['role'] });
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        role: true,
      },
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      relations: { role: true },
      where: { username },
    });
  }

  async getOrCreate(user: User): Promise<User> {
    return this.usersRepository.manager.transaction(
      (transactionnalEntityManager): Promise<User> => {
        return transactionnalEntityManager
          .createQueryBuilder(User, 'user')
          .setLock('pessimistic_read')
          .where({ user: Equal(user.username) })
          .getOne()
          .then(async (result) => {
            const newuser: User = result;

            if (undefined === newuser) {
              const newuser: User = transactionnalEntityManager.create(
                User,
                user,
              );
              return await transactionnalEntityManager.save<User>(newuser);
            }
            return newuser;
          });
      },
    );
  }
}
