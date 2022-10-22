import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
//import { APP_GUARD } from '@nestjs/core';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsService } from './projects/projects.service';
import { ProjectsController } from './projects/projects.controller';
import { Project } from './projects/project.entity';
import { Task } from './tasks/task.entity';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { Role } from './roles/roles.entity';
import { RolesModule } from './roles/roles.module';
import { UsersprojectsModule } from './usersprojects/usersprojects.module';
import { KanbanstatusModule } from './kanbanstatus/kanbanstatus.module';
import { TasksassignmentsModule } from './tasksassignments/tasksassignments.module';
import { TimeentriesModule } from './timeentries/timeentries.module';
import { UsersprojectsController } from './usersprojects/usersprojects.controller';
import { UserProject } from './usersprojects/userproject.entity';
import { UsersprojectsService } from './usersprojects/usersprojects.service';
import { KanbanStatus } from './kanbanstatus/kanbanstatus.entity';
import { KanbanstatusController } from './kanbanstatus/kanbanstatus.controller';
import { KanbanstatusService } from './kanbanstatus/kanbanstatus.service';
import { TaskAssignment } from './tasksassignments/taskassignment.entity';
import { TasksAssignmentsController } from './tasksassignments/tasksassignments.controller';
import { TasksAssignmentsService } from './tasksassignments/tasksassignments.service';
import { TimeentriesController } from './timeentries/timeentries.controller';
import { TimeentriesService } from './timeentries/timeentries.service';
import { TimeEntry } from './timeentries/timeentries.entity';
import { TasktypesModule } from './tasktypes/tasktypes.module';
import { TaskType } from './tasktypes/tasktype.entity';
import { TasktypesController } from './tasktypes/tasktypes.controller';
import { TasktypesService } from './tasktypes/tasktypes.service';
import { SearchModule } from './search/search.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'moi1971moi',
      database: 'postgres',
      entities: [
        User,
        Project,
        Task,
        Role,
        UserProject,
        KanbanStatus,
        TaskAssignment,
        TimeEntry,
        TaskType,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    RolesModule,
    UsersprojectsModule,
    KanbanstatusModule,
    TasksassignmentsModule,
    TimeentriesModule,
    TasktypesModule,
    SearchModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    ProjectsController,
    RolesController,
    UsersprojectsController,
    KanbanstatusController,
    TasksAssignmentsController,
    TimeentriesController,
    TasktypesController,
  ],
  providers: [
    AppService,
    UsersService,
    AuthService,
    ProjectsService,
    RolesService,
    UsersprojectsService,
    KanbanstatusService,
    TasksAssignmentsService,
    TimeentriesService,
    TasktypesService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    //  },
  ],
})
export class AppModule { }
