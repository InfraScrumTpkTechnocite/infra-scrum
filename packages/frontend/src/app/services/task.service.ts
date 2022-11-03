import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
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
        console.table(response);
    }

    create(task: Task): Observable<Task> {
        return this.httpClient
            .post<any>('/backend/tasks', JSON.stringify(task), this.httpOptions)
            /*.pipe(
                tap((response) => this.log(response)),
                catchError((error) => this.handleError(error, null))
            );*/
    }

    findAllOfKanbanstatus(kanbanstatusid: string): Observable<Task[]> {
        return this.httpClient.get<any>(
            '/backend/tasks/of/kanbanstatus/' + kanbanstatusid,
            this.httpOptions
        );
    }

    edit(task: Task): Observable<Task> {
        return this.httpClient.put<any>(
            '/backend/tasks/' + task.id,
            JSON.stringify(task),
            this.httpOptions
        );
    }
}
