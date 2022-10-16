import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    title: string = '';
    isMenuOpen: boolean = false;
    user: User = new User();

    constructor(
        public authService: AuthService,
        private headerTitleService: HeaderTitleService
    ) {}

    ngOnInit(): void {
        this.headerTitleService.title.subscribe((updatedTitle) => {
            this.title = updatedTitle;
        });
        
        this.headerTitleService.user.subscribe((user: User) => {
            this.user = user;
        });
    }

    loggedIn() {
        return this.authService.isAuthenticated();
    }

    logOut() {
        this.isMenuOpen = false;
        localStorage.removeItem('jwt-token'); //force token delete
        localStorage.removeItem('user');
        this.headerTitleService.user.subscribe((user: User) => {
            this.user = user;
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    isSuperadmin() {
        return this.user.role.name === 'superadmin';
    }
}
