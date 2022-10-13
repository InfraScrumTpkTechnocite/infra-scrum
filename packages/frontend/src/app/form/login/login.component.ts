import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

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
        private route: ActivatedRoute,
        private httpClient: HttpClient,
        private toast: HotToastService
    ) { }

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');

        // if (this.route.queryParams)
        //     this.route.queryParams
        //         .subscribe(params => {
        //             console.log(params);
        //             this.username = params['username'];
        //             this.token = params['token'];
        //             console.log(`login.component.ts - ngOnInit - username/token : ${this.username}/${this.token}`); // price
        //             if (this.username && this.token) {
        //                 this.httpClient.get(`backend/auth/confirm/${this.username}/${this.token}`)
        //                     //return this.httpClient.post<User>("/backend/registeruser", JSON.stringify(user), this.httpOptions)
        //                     // .pipe(
        //                     //     tap((response) => {
        //                     //         console.log(`index.component.ts - onInit - get email confirmation = ${response}`);
        //                     //     }),
        //                     //     //catchError((error) => console.log(`index.component.ts - onInit - erreur - ${error}`))
        //                     // ).subscribe();
        //                     .pipe(
        //                         this.toast.observe({
        //                             loading: 'Confirming email...',
        //                             success: 'Email confirmed ! Use your credentials to log in.',
        //                             error: 'Email confirmation link sent to your mail box. Please confirm your email first.',
        //                         })
        //                     )
        //                     .subscribe();
        //             }
        //         }
        //         );

    }

    onSubmit() {
        // console.log(`username : ${this.profileForm.controls.username.value}`);
        // console.log(`password : ${this.profileForm.controls.password.value}`);
        if (this.profileForm.controls.username.value) localStorage.setItem('username', this.profileForm.controls.username.value);

        localStorage.removeItem('jwt-token'); //force token delete
        localStorage.removeItem('user');

        const authObserver = {
            next: (response: any) => {
                this.router.navigate(['projects']);
            },
            error: (error: Error) => {
                this.showErrorMessage = true;
                //console.log(`Error : ${error.message}`);
            },
            complete: () => {
                console.log(`login process completed.`);
            }
        }

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
