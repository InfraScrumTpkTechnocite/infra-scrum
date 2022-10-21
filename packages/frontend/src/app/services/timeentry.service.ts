import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TimeEntry } from '../models/timeentry.model';

@Injectable({
  providedIn: 'root'
})
export class TimeentryService {

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

  create(timeentry: TimeEntry): Observable<TimeEntry> {

    return this.httpClient.post<any>("/backend/timeentries", JSON.stringify(timeentry), this.httpOptions)
    .pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error,null))
    );
  }

  totalWorkedTimeOfTask(taskid: string): Observable<any> {
    return this.httpClient.get<any>("/backend/timeentries/totalusersworkedtimeontask/" + taskid, this.httpOptions);
  }

}
