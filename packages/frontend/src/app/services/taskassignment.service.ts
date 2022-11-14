import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TaskAssignment } from '../models/taskassignment.model';

@Injectable({
  providedIn: 'root'
})
export class TaskassignmentService {

  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization : 'Bearer ' + localStorage.getItem('jwt-token')
    })
  };

  constructor(
    private httpClient : HttpClient
  ) { }

  private handleError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }

  private log(response: any){
    console.table(response);
  }

  create(taskassignment: TaskAssignment): Observable<TaskAssignment> {
    console.log(taskassignment);
    return this.httpClient.post<any>("/backend/tasksassignments", JSON.stringify(taskassignment), this.httpOptions)
    .pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error,null))
    );
  }

  findAllUsersOfTask(taskid: string): Observable<TaskAssignment[]> {
    return this.httpClient.get<any>("/backend/tasksassignments/taskusers/" + taskid, this.httpOptions);
  }
}
