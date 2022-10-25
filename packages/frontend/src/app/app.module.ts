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
import { UserProfileComponent } from './form/user-profile/user-profile.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProjectinfoComponent } from './projectinfo/projectinfo.component';
import { InitialsNamePipe } from './pipes/initials-name.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './utils/loading.interceptor';

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
        UserProfileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        DragDropModule,
        HotToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
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
