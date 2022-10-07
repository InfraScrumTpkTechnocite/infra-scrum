import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { Observable, of, tap } from 'rxjs';

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
    private httpClient: HttpClient
  ) { }

  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }

  private log(response: any) {
    console.table(response);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>("/backend/users", JSON.stringify(user), this.httpOptions)
      //return this.httpClient.post<User>("/backend/registeruser", JSON.stringify(user), this.httpOptions)
      .pipe(
        tap((response) => {
          this.log(`role-service-createUser- response = ${response}`);
        }),
        //catchError((error) => this.handleError(error, null))
      );
  }

  findUserByUsername(username: string): Observable<any> {
    return this.httpClient.get(`/backend/users/username/${username}`, this.httpOptions)
     .pipe(
      tap((response) => {
        console.log(`user.service.ts - findUserByUsername - response = ${response}`);
      }),
      catchError((error) => this.handleError(error,null))
    );
  }
}
