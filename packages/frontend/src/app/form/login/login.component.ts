import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

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
    username: any;
    token: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        private headerTitleService: HeaderTitleService,
        private toast: HotToastService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');
    }

    onSubmit() {
        // console.log(`username : ${this.profileForm.controls.username.value}`);
        // console.log(`password : ${this.profileForm.controls.password.value}`);
        if (this.profileForm.controls.username.value)
            localStorage.setItem(
                'username',
                this.profileForm.controls.username.value
            );

        localStorage.removeItem('jwt-token'); //force token delete
        localStorage.removeItem('user');

        const userObserver = {
            next: (response: User) => {
                localStorage.setItem('user', JSON.stringify(response));
                this.router.navigate(['projects']);
            },
            error: (err: any) => {
                console.log(err);
            },
            complete: () => {
                // console.log(`Login - get user complete`);
            }
        };

        const authObserver = {
            next: (response: any) => {
                //console.log(`response = ${JSON.stringify(response)}`)
                //this.router.navigate(['projects']);
            },
            error: (error: Error) => {
                this.showErrorMessage = true;
                //console.log(`Error : ${error.message}`);
            },
            complete: () => {
                // console.log(`login process completed.`);
                var username = localStorage.getItem('username');
                if (username)
                    this.userService
                        .findUserByUsername(username)
                        .subscribe(userObserver);
            }
        };

        if (
            this.profileForm.controls.username.value &&
            this.profileForm.controls.password.value
        )
            this.authService
                .login(
                    this.profileForm.controls.username.value,
                    this.profileForm.controls.password.value
                )
                .subscribe(authObserver);
        //this.authService.isLoggedIn = true;
    }

    showToast() {
        this.toast.show('Hello World!');
        this.toast.loading('Lazyyy...');
        this.toast.success('Yeah!!');
        this.toast.warning('Boo!');
        this.toast.error('Oh no!');
        this.toast.info('Something...');
    }
}
