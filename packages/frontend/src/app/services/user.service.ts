import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { Observable, of, tap } from 'rxjs';
import { response } from 'express';

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

    constructor(private httpClient: HttpClient) {}

    private handleError(error: Error, errorValue: any) {
        console.error(error);
        return of(errorValue);
    }

    private log(response: any) {
        //console.log(response);
    }

    createUser(user: User): Observable<User> {
        return this.httpClient.post<User>(
            '/backend/users',
            JSON.stringify(user),
            this.httpOptions
        );
        //return this.httpClient.post<User>("/backend/registeruser", JSON.stringify(user), this.httpOptions)

        // .pipe(
        //   tap((response) => {
        //     this.log(`role-service-createUser- response = ${response}`);
        //   }),
        //   catchError((error) => this.handleError(error, null))
        // );
    }

    findUserByUsername(username: string): Observable<any> {
        return this.httpClient
            .get(`/backend/users/username/${username}`, this.httpOptions)
            .pipe(
                tap((response) => {
                    this.log(
                        'user.service - findUserByUsername - response = ' +
                            JSON.stringify(response)
                    );
                }),
                catchError((error) => this.handleError(error, null))
            );
    }

    getAllUsers(): Observable<User[]> {
        return this.httpClient
            .get<User[]>('/backend/users', this.httpOptions)
            .pipe(
                tap((response) => {
                    this.log(
                        `user.service - getAllUsers - response = ${response}`
                    );
                }),
                catchError((error) => this.handleError(error, null))
            );
    }

    getUserbyId(userId: string): Observable<User> {
        return this.httpClient
            .get<User>('/backend/users/' + userId, this.httpOptions)
            .pipe(
                tap((response) => {
                    this.log(
                        `user-service-getuserbyid- response = ${response}`
                    );
                }),
                catchError((error) => this.handleError(error, null))
            );
    }

    /*image "user.picture*/
    
    getBase64(event: Blob): Observable<string> {
        return new Observable<string>(sub => {
          const reader = new FileReader();
          reader.readAsDataURL(event);
          reader.onload = () => {
            sub.next(reader.toString());
            sub.complete();
          };
          reader.onerror = error => {
            sub.error(error);
          };
        })
      }

    editUser(user: User): Observable<User> {
        return this.httpClient
            .put<User>(
                '/backend/users/' + user.id,
                JSON.stringify(user),
                this.httpOptions
            )
            .pipe(
                tap((response) => {
                    this.log(`user-service-edituser- response = ${response}`);
                }),
                catchError((error) => this.handleError(error, null))
            );
    }
}
