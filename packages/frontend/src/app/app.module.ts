import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './form/login/login.component';
import { EditNewTasksComponent } from './form/edit-new-tasks/edit-new-tasks.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CreateUserComponent } from './form/create-user/create-user.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        HeaderComponent,
        LoginComponent,
        EditNewTasksComponent,
        CreateUserComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatFormFieldModule,
        HttpClientModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],

    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
