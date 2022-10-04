import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
    })
  };

  private handleError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }

  private log(response: any){
    //console.table(response);
  }

  constructor(  
    private httpClient : HttpClient 
  ) { }

  getRoleByName(name: string): Observable<Role> {
    return this.httpClient.get<Role>("/backend/roles/name/" + name, this.httpOptions)
    .pipe(
        tap((response) => this.log(response)),
        catchError((error) => this.handleError(error,null))
      );
  }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>("/backend/roles", this.httpOptions)
    .pipe(
        tap((response) => this.log(response)),
        catchError((error) => this.handleError(error,null))
      );
  }

  getRoleByName(name: string): Observable<Role>{
    return this.httpClient.get<Role[]>("/backend/roles/name/" + name, this.httpOptions)
    .pipe(
        tap((response) => this.log(response)),
        catchError((error) => this.handleError(error,null))
      );
  }

  createRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>("/backend/roles", JSON.stringify(role), this.httpOptions)
      .pipe(
        tap((response) => this.log(response)),
        catchError((error) => this.handleError(error, null))
      );
  }

}
