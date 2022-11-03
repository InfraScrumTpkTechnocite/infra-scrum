import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { CreateUserComponent } from './form/create-user/create-user.component';
import { LoginComponent } from './form/login/login.component';
import { IndexComponent } from './index/index.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuardService } from './services/auth-guard.service';

import { EditProjectComponent } from './form/edit-project/edit-project.component';
import { EditNewTasksComponent } from './form/edit-new-tasks/edit-new-tasks.component';
import { UserProfileComponent } from './form/user-profile/user-profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    {path: 'user-profile', component: UserProfileComponent},
    {
        path: 'admin',
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin']
        },
        loadChildren: () =>
            import('./admin/admin.module').then((m) => m.AdminModule)
    },
    {
        path: 'index',
        component: IndexComponent
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin', 'admin', 'employee', 'intern', 'guest']
        }
    },
    {
        path: 'project',
        component: ProjectComponent,
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin', 'admin', 'employee', 'intern']
        }
    },

    {
        path: 'edit-new-tasks',
        component: EditNewTasksComponent,
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin', 'admin', 'employee', 'intern']
        }
    },
    {
        path: 'project/edit-project',
        component: EditProjectComponent,
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin', 'admin', 'employee']
        }
    },
    {
        path: 'create-user',
        component: CreateUserComponent,
        canActivate: [AuthGuardService],
        data: {
            role: ['superadmin']
        }
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    //for providers, see https://stackoverflow.com/questions/49739277/nullinjectorerror-no-provider-for-jwthelperservice
    providers: [
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
    ]
})
export class AppRoutingModule {}
