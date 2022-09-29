import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //bearerToken à changer
  //bearerToken :string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdpbGxlcyIsInN1YiI6IjYzNWUwMDBhLTUyOTEtNGMwOS05MmViLTQxZWU2OTRkZWI3MiIsImlhdCI6MTY2NDI2MzUwMSwiZXhwIjoxNjY5NDQ3NTAxfQ.ChkBQt-6jZ3xLBPexdSIjwU--PaUJ0qoLQMXVuaqvNw";
  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization : 'Bearer ' + localStorage.getItem('jwt-token')
    })
  };

  constructor(private httpClient : HttpClient) { }

  private handleError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }

  private log(response: any){
    console.table(response);
  }

  createUser(user: User): Observable<User> {
    user.role = "f5e44de5-4cfb-42af-8609-0d8d9867f517";
    
    return this.httpClient.post<any>("/backend/users", JSON.stringify(user), this.httpOptions)
    .pipe(
        tap((response) => this.log(response)),
        catchError((error) => this.handleError(error,null))
      );
  }
}
