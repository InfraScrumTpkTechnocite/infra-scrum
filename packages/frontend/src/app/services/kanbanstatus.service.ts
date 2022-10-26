import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { Kanbanstatus } from '../models/kanbanstatus.model';

@Injectable({
    providedIn: 'root'
})
export class KanbanstatusService {

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

    
    create(kanbanstatus: Kanbanstatus): Observable<Kanbanstatus> {
        return this.httpClient.post<any>("/backend/kanbanstatus", JSON.stringify(kanbanstatus), this.httpOptions)
            .pipe(
                tap((response) => this.log(response)),
                catchError((error) => this.handleError(error, null))
                );
            }
            
    findAllOfProject(projectid: string): Observable<Kanbanstatus[]> {
        return this.httpClient.get<any>("/backend/kanbanstatus/of/project/" + projectid, this.httpOptions);
    }
    
    edit(kanbanstatus: Kanbanstatus): Observable<any> {
        return this.httpClient.put<any>("/backend/kanbanstatus/"+ kanbanstatus.id, JSON.stringify(kanbanstatus), this.httpOptions)
            // .pipe(
            //     tap((response) => this.log(response)),
            //     catchError((error) => this.handleError(error, null))
            // );
    }

    delete(kanbanstatusId: string): Observable<any> {
        return this.httpClient.delete<any>("/backend/kanbanstatus/"+ kanbanstatusId, this.httpOptions)
            // .pipe(
            //     tap((response) => this.log(response)),
            //     catchError((error) => this.handleError(error, null))
            // );
    }
}