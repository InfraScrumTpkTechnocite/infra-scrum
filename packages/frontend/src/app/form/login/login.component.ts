import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    profileForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });
    showErrorMessage: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private headerTitleService: HeaderTitleService
    ) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');
    }

    onSubmit() {
        // console.log(`username : ${this.profileForm.controls.username.value}`);
        // console.log(`password : ${this.profileForm.controls.password.value}`);

        localStorage.removeItem('jwt-token'); //force token delete

        if (
            this.profileForm.controls.username.value &&
            this.profileForm.controls.password.value
        )
            this.authService
                .login(
                    this.profileForm.controls.username.value,
                    this.profileForm.controls.password.value
                )
                .subscribe({
                    next: (response) => {
                        this.router.navigate(['projects']);
                    },
                    error: (error) => {
                        this.showErrorMessage = true;
                        //console.log(`Error : ${error.message}`);
                    },
                    complete: () => {
                        console.log(`login process completed.`);
                    }
                });
        //this.authService.isLoggedIn = true;
    }
}
