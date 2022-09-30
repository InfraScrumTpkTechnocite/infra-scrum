import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TaskType } from '../models/tasktype.model';

@Injectable({
  providedIn: 'root'
})
export class TasktypeService {

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

  create(tasktype: TaskType): Observable<TaskType> {

    return this.httpClient.post<any>("/backend/tasktypes", JSON.stringify(tasktype), this.httpOptions)
    .pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error,null))
    );
  }

}
