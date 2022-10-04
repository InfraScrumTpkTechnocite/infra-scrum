import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { Observable, of, tap } from 'rxjs';
import { RoleService } from './role.service';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
    })
  };

  constructor(
    private httpClient: HttpClient,
    private roleService: RoleService
  ) { }

  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }

  private log(response: any) {
    console.table(response);
  }

  createUser(user: User){
    
    const roleObserver = {
      next: (role: Role) => {
        user.role = role;
      },
      error: (err: Error) => {
         this.handleError(err, null);
      },
      complete: () => {
        this.httpClient.post<User>("/backend/users/", JSON.stringify(user), this.httpOptions)
          .pipe(
            tap((response) => this.log(response)),
            catchError((error) => this.handleError(error, null))
          ).subscribe();
      },
    };
  
    this.roleService.getRoleByName("guest").subscribe(roleObserver);
  
  }
}
