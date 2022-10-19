import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
    userProjects = [];
    mySubscription: any;

    constructor(
        public authService: AuthService,
        private headerTitleService: HeaderTitleService,
        private router: Router,private activatedRoute: ActivatedRoute
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnInit(): void {
        this.headerTitleService.title.subscribe((updatedTitle) => {
            this.title = updatedTitle;
        });

        this.headerTitleService.user.subscribe((user: User) => {
            this.user = user;
        });

        this.headerTitleService.userProjects.subscribe((userProjects: any) => {
            this.userProjects = userProjects;
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

    onChange(event: any) {
        console.log(`header.component - onChange - ${event.target.value}`); //id du projet sélectionné
    }

    ngOnDestroy() {
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
    }

    onLoginClick() {
        this.router.navigate(['login']);
    }
}
