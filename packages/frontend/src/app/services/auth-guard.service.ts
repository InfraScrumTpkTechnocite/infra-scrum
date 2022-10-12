import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, url: any): boolean {
    if (!this.authService.isAuthenticated()) {
      // let user: any = localStorage.getItem('user')
      // let userRole: string = JSON.parse(user).role.name;
      // console.log(`auth-guard.service - canActivate - user: ${user.username}, role: ${user.role.name}`);
      // if (route.data.role && route.data.role.indexOf(user.role.name) === -1) {
      this.router.navigate(['login']);
      return false;
    }
    // }
    return true;
  }
}
