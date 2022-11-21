import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { HeaderTitleService } from '../services/header-title.service';
import { UserService } from '../services/user.service';
import { UserprojectService } from '../services/userproject.service';

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
        private translate: TranslateService,
        private headerTitleService: HeaderTitleService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private userProjectService: UserprojectService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    changeLanguage(): void {
        this.translate.currentLang == 'en'
            ? this.translate.use('fr')
            : this.translate.use('en');
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

        //exemple pour récupérer les projets d'un user...
        const userProjectsObserver = {
            next: (value: any) => {
                this.userProjects = value; //tous les user-projects (contenants toutes les infos du projet)
                this.headerTitleService.setUserProjects(value);
                var usertmp: any = localStorage.getItem('user');
                var user: User = JSON.parse(usertmp);
                if (user) this.headerTitleService.setUsername(user);
            },
            error: (err: Error) => {
                console.log(`${err}`);
            },
            complete: () => {
                console.log(`get user's projects completed.`);
            }
        };
        //...et attention : le userid n'est certainement pas le bon !
        //this.userProjectService.findUserProjects('32e5d252-51ea-48d6-aed3-a8cd4bf06e90').subscribe(userProjectsObserver);

        const userObserver = {
            next: (response: User) => {
                localStorage.setItem('user', JSON.stringify(response));
                //pour lire le localStorage :
                //var user = JSON.parse(localStorage.getItem('user'));
                if (response.id)
                    this.userProjectService
                        .findCurrentUserProjects(response.id)
                        .subscribe(userProjectsObserver);
            },
            error: (err: Error) => {
                console.log(`Error: ${err}`);
            },
            complete: () => {
                console.log(`login.component.ts - get user completed.`);
            }
        };
        //console.log(`login.component.ts - onSubmit - token=${localStorage.getItem('jwt-token')}`);
        var username = localStorage.getItem('username');
        if (username)
            this.userService
                .findUserByUsername(username)
                .subscribe(userObserver);
    }
    getLangs() {}

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
        //console.log(`header.component - onChange - ${event.target.value}`); //id du projet
        if (event.target.value) {
            this.router.navigate(['/project'], {
                queryParams: { projectid: event.target.value }
            });
        }
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
