import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserProject } from '../models/userproject.model';

@Injectable({
  providedIn: 'root'
})
export class UserprojectService {

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

  create(userproject: UserProject): Observable<UserProject> {

    return this.httpClient.post<any>("/backend/usersprojects", JSON.stringify(userproject), this.httpOptions)
    .pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error,null))
    );
  }

}
