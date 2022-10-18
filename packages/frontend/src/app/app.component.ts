import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'frontend';
    mySubscription: any;

    //   user!: { firstName: string; lastName: string; };
    // welcome!: string;
    // usernameLabel!: string;
    // passwordLabel!: string;

    constructor(private translate: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        translate.addLangs(['en', 'klingon']);
        translate.setDefaultLang('en');
        translate.use('en');

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnInit() {
        // hardcoded example
        // this.user = { firstName: 'Sammy', lastName: 'Shark' };
        // synchronous. Also interpolate the 'firstName' parameter with a value.
        // this.welcome = this.translate.instant('welcomeMessage', { firstName: this.user.firstName });
        // asynchronous - gets translations then completes.
        // this.translate.get(['login.username', 'login.password'])
        //   .subscribe(translations => {
        //     this.usernameLabel = translations['login.username'];
        //     this.passwordLabel = translations['login.password'];
        //   });
    }

    ngOnDestroy() {
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
    }
}
