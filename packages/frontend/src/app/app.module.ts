import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './form/login/login.component';
import { EditNewTasksComponent } from './form/edit-new-tasks/edit-new-tasks.component';
import { CreateUserComponent } from './form/create-user/create-user.component';
import {
    HttpClientModule,
    HttpClient,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchPasswordDirective } from './directives/password-pattern.directive';
import { ProjectsComponent } from './projects/projects.component';
import { OutsideClickDirective } from './directives/outside-click.directive';
import { EditProjectComponent } from './form/edit-project/edit-project.component';
import { ProjectComponent } from './project/project.component';
import { KanbanStatusComponent } from './kanban-status/kanban-status.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskComponent } from './task/task.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProjectinfoComponent } from './projectinfo/projectinfo.component';
import { InitialsNamePipe } from './pipes/initials-name.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './utils/loading.interceptor';
import { EditProjectuserComponent } from './form/edit-project/components/edit-projectuser/edit-projectuser.component';
import { EditDeliverydateComponent } from './form/edit-project/components/edit-deliverydate/edit-deliverydate.component';
import { EditProjectInfoComponent } from './form/edit-project/components/edit-project-info/edit-project-info.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';

import { NumberToIntegerPipe } from './pipes/number-to-integer.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { ChartGanttComponent } from './project/components/chart-gantt/chart-gantt.component';
import { TasksHistoryComponent } from './project/components/tasks-history/tasks-history.component'
import { TableUsersComponent } from './table-users/table-users.component';
import { EditTasksComponent } from './form/edit-new-tasks/components/edit-tasks/edit-tasks.component';
import { TimeTasksComponent } from './form/edit-new-tasks/components/time-tasks/time-tasks.component'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        HeaderComponent,
        LoginComponent,
        CreateUserComponent,
        MatchPasswordDirective,
        EditNewTasksComponent,
        ProjectsComponent,
        EditProjectComponent,
        OutsideClickDirective,
        ProjectComponent,
        KanbanStatusComponent,
        TaskComponent,
        ProjectinfoComponent,
        InitialsNamePipe,
        SpinnerComponent,
        EditProjectuserComponent,
        EditDeliverydateComponent,
        EditProjectInfoComponent,
        PageNotFoundComponent,
        NumberToIntegerPipe,
        ChartGanttComponent,
        TasksHistoryComponent,
        TableUsersComponent,
        EditTasksComponent,
        TimeTasksComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatSlideToggleModule,
        MatTableModule,
        ReactiveFormsModule,
        DragDropModule,
        HotToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            defaultLanguage: navigator.language.split('-')[0],
            useDefaultLang: false
        }),
        MatDialogModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatMenuModule
    ],
    exports: [TranslateModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
