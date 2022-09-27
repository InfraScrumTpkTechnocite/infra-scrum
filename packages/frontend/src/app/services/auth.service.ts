import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    isLoggedIn: boolean = false;

    login(username: string, password: string) {
        return this.http
            .post<any>('/backend/auth/login', { username, password })
            .pipe(
                map((token) => {
                    localStorage.setItem('jwt-token', token.access_token);
                    return token;
                })
            );
    }
}
