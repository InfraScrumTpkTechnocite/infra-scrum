import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  Unique,
  ObjectID,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.entity';
import { IsEmail, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

@Entity()
@Unique(['username'])
@Index(['username'])
@Unique(['email'])
@Index(['email'])
export class User {
  toJSON() {
    delete this.password; //no hashed password in returned queries !
    return this;
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'gilles', description: 'User login name (unique)' })
  @Column()
  username: string;

  @ApiProperty({ example: 'aze@rty.com', description: 'User email (unique)' })
  @Column()
  @ValidateIf(value => value === "")
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'User firstname' })
  @Column({ nullable: true })
  @IsOptional()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'User lastname' })
  @Column({ nullable: true })
  @IsOptional()
  lastname: string;

  @ApiProperty({ example: 'gilles', description: 'Hashed password' })
  //  @Column({select: false})
  @Column()
  @ValidateIf(value => value === "")
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'a uuid...', description: 'Role id' })
  @ManyToOne(() => Role, (role) => role.id, { nullable: false })
  //@JoinColumn({ name: 'role' })
  role: Role;

  @ApiProperty({ example: 'some image', description: 'User picture' })
  @Column({ nullable: true })
  @IsOptional()
  picture: string;

  // @ApiProperty({ example: 'true or false', description: 'User active' })
  // @Column({ default: false })
  // active: boolean;

  // @ApiProperty({ example: '1111', description: '4 digits token' })
  // @Column({ default: null })
  // token: string;
}
