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
    
    create(project: Project): Observable<Project> {
        
        return this.httpClient.post<any>("/backend/projects", JSON.stringify(project), this.httpOptions);
    }
    
    findOne(id: string) {
        return this.httpClient.get<any>("/backend/projects/" + id, this.httpOptions);
    }
    
    findSprints(id: string){
        return this.httpClient.get<any>(`/backend/projects/${id}/sprints`, this.httpOptions);
    }
        
}
