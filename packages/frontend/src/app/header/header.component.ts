import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    title: string = '';
    constructor(
        public authService: AuthService,
        private headerTitleService: HeaderTitleService
    ) {}

    ngOnInit(): void {
        this.headerTitleService.title.subscribe((updatedTitle) => {
            this.title = updatedTitle;
        });
    }
    loggedIn() {
        return this.authService.isAuthenticated();
    }

    logOut() {
        localStorage.removeItem('jwt-token');
    }
}
