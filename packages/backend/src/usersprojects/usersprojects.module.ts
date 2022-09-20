import { Module } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { UsersprojectsController } from './usersprojects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProject } from './userproject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProject])],
  exports: [TypeOrmModule, UsersprojectsService],
  providers: [UsersprojectsService],
  controllers: [UsersprojectsController],
})
export class UsersprojectsModule {}
