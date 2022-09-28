import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) { }
  
  //isLoggedIn: boolean = false;

  login(username: string, password: string) {
    return this.http.post<any>('/backend/auth/login', {username, password})
      .pipe(map( (token) => {
        localStorage.setItem('jwt-token', token.access_token);
        return token;
      }))
  }

    public isAuthenticated(): boolean {
        const token: any = localStorage.getItem('jwt-token'); // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }
}
