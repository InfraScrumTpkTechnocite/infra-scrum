import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditNewTasksComponent } from './form/edit-new-tasks/edit-new-tasks.component';
import { CreateUserComponent } from './form/create-user/create-user.component';
import { LoginComponent } from './form/login/login.component';
import { IndexComponent } from './index/index.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: 'edit-new-tasks', component: EditNewTasksComponent },
    { path: 'create-user', component: CreateUserComponent},
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
