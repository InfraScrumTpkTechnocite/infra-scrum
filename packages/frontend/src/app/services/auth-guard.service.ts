import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(public authService: AuthService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, url: any): boolean {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }

        let user: any = localStorage.getItem('user');
        let userObject: User = JSON.parse(user);
        //console.table(userObject);
        let role: any = userObject.role;
        console.log(
            `auth-guard.service - canActivate - user=${userObject.username}, role=${role.name}`
        );

        // let userRole: string = JSON.parse(user).role.name;
        // console.log(`auth-guard.service - canActivate - user: ${user.username}, role: ${userRole}`);
        if (
            route.data['role'] &&
            route.data['role'].indexOf(role.name) === -1
        ) {
            this.router.navigate(['projects']);
            return false;
        }

        return true;
    }
}
