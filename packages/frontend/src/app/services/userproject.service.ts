import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserProject } from '../models/userproject.model';

@Injectable({
    providedIn: 'root'
})
export class UserprojectService {
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
        // console.table(response);
    }

    create(userproject: UserProject): Observable<UserProject> {
        return this.httpClient.post<any>(
            '/backend/usersprojects',
            JSON.stringify(userproject),
            this.httpOptions
        );
        // .pipe(
        //     tap((response) => this.log(response)),
        //     catchError((error) => this.handleError(error, null))
        // );
    }

    findAll(): Observable<UserProject[]> {
        return this.httpClient.get<any>(
            `/backend/usersprojects/`,
            this.httpOptions
        );
    }

    findAllAssignedAtLeastOnce(): Observable<UserProject[]> {
        return this.httpClient.get<any>(
            `/backend/usersprojects/findallassignedatleastonce`,
            this.httpOptions
        );
    }

    findCurrentUserProjects(userid: string): Observable<any> {
        return this.httpClient.get(
            `/backend/usersprojects/currentuserprojects/${userid}`,
            this.httpOptions
        );
        // .pipe(
        //     tap((response) => {
        //         console.log(
        //             `userproject.service.ts - findUserProjects - response = ${response}`
        //         );
        //     }),
        //     catchError((error) => this.handleError(error, null))
        // );
    }

    findCurrentProjectUsers(projectid: string): Observable<any> {
        return this.httpClient.get(
            `/backend/usersprojects/currentprojectusers/${projectid}`,
            this.httpOptions
        );
    }

    delete(userProjectId: string): Observable<any> {
        return this.httpClient.delete(
            `/backend/usersprojects/${userProjectId}`,
            this.httpOptions
        );
    }

    update(userProjectId: string, userProject: UserProject): Observable<any> {
        return this.httpClient.put(
            `/backend/usersprojects/${userProjectId}`,
            userProject,
            this.httpOptions
        );
    }
}
