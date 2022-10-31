import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { RolesModule } from './roles/roles.module';
import { UsersprojectsModule } from './usersprojects/usersprojects.module';
import { KanbanstatusModule } from './kanbanstatus/kanbanstatus.module';
import { TasksassignmentsModule } from './tasksassignments/tasksassignments.module';
import { TimeentriesModule } from './timeentries/timeentries.module';
import { UsersprojectsController } from './usersprojects/usersprojects.controller';
import { UsersprojectsService } from './usersprojects/usersprojects.service';
import { KanbanstatusController } from './kanbanstatus/kanbanstatus.controller';
import { KanbanstatusService } from './kanbanstatus/kanbanstatus.service';
import { TasksAssignmentsController } from './tasksassignments/tasksassignments.controller';
import { TasksAssignmentsService } from './tasksassignments/tasksassignments.service';
import { TimeentriesController } from './timeentries/timeentries.controller';
import { TimeentriesService } from './timeentries/timeentries.service';
import { TasktypesModule } from './tasktypes/tasktypes.module';
import { TasktypesController } from './tasktypes/tasktypes.controller';
import { TasktypesService } from './tasktypes/tasktypes.service';
import { SearchModule } from './search/search.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: config.get<any>('DATABASE_TYPE'),
        database: config.get<string>('DATABASE_NAME'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT')),
        autoLoadEntities: config.get<boolean>('TYPEORM_AUTOLOADENTITIES'),
        synchronize: config.get<boolean>('TYPEORM_SYNCHRONIZE'),
        logging: config.get('TYPEORM_LOGGING').split(','),
        maxQueryExecutionTime: config.get<number>(
          'TYPEORM_MAXQUERTEXECUTIONTIME',
        ),
      }),
      inject: [ConfigService],
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
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log(this.configService.get<string>('DATABASE_HOST'));
  }
}
