import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './form/login/login.component';
import { EditNewTasksComponent } from './form/edit-new-tasks/edit-new-tasks.component';
import { CreateUserComponent } from './form/create-user/create-user.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchPasswordDirective } from './directives/password-pattern.directive';
import { ProjectsComponent } from './projects/projects.component';
import { OutsideClickDirective } from './directives/outside-click.directive';
import { EditProjectComponent } from './form/edit-project/edit-project.component';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
        EmailConfirmComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        HotToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
          }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
