import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TaskAssignment } from '../models/taskassignment.model';

@Injectable({
    providedIn: 'root'
})
export class TaskassignmentService {
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
        })
    };

    constructor(private httpClient: HttpClient) {}

    create(taskassignment: TaskAssignment): Observable<TaskAssignment> {
        return this.httpClient
            .post<any>(
                '/backend/tasksassignments',
                JSON.stringify(taskassignment),
                this.httpOptions
            )
    }

    findAllUsersOfTask(taskid: string): Observable<TaskAssignment[]> {
        return this.httpClient.get<any>(
            '/backend/tasksassignments/taskusers/' + taskid,
            this.httpOptions
        );
    }

    delete(taskassignmentId: string): Observable<TaskAssignment> {
        return this.httpClient.delete<any>(
            '/backend/tasksassignments/' + taskassignmentId,
            this.httpOptions
        );
    }
}
