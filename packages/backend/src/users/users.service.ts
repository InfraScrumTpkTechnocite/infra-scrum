import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { hash } from 'bcrypt';
//import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    //private mailService: MailService
  ) { }

  async create(user: User): Promise<User> {
    user.password = await hash(user.password, 10);
    // const token = Math.floor(1000 + Math.random() * 9000).toString();
    // user.token = token;
    // await this.mailService.sendUserConfirmation(user, token);
    return await this.usersRepository.save(user);
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
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      relations: ['role'],
      where: { username },
    });
  }
}
