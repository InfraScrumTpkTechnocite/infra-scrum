import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'frontend';

    //   user!: { firstName: string; lastName: string; };
    // welcome!: string;
    // usernameLabel!: string;
    // passwordLabel!: string;
    
    constructor() {
        

    ngOnInit() 
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
}


function ngOnInit() {
    throw new Error('Function not implemented.');
}

