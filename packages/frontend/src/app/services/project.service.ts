import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
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

    create(project: Project): Observable<Project> {
        return this.httpClient
            .post<any>(
                '/backend/projects',
                JSON.stringify(project),
                this.httpOptions
            )
            .pipe(
                tap((response) => this.log(response)),
                catchError((error) => this.handleError(error, null))
            );
    }

    update(project: Project): Observable<Project> {
        return this.httpClient.put<Project>(
            '/backend/projects/' + project.id,
            JSON.stringify(project),
            this.httpOptions
        );
        // .pipe(
        //     tap((response) => this.log(response)),
        //     catchError((error) => this.handleError(error, null))
        // );
    }

    findOne(id: string): Observable<Project> {
        return this.httpClient.get<any>(
            '/backend/projects/' + id,
            this.httpOptions
        );
    }

    findSprintsOnly(id: string): Observable<Project[]> {
        return this.httpClient.get<any>(
            `/backend/projects/${id}/sprintsonly`,
            this.httpOptions
        );
    }

    findProjectsOnly(): Observable<Project[]> {
        return this.httpClient.get<any>(
            `/backend/projects/projects/only`,
            this.httpOptions
        );
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete<any>(
            '/backend/projects/' + id,
            this.httpOptions
        );
    }
}
