import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { User } from 'src/app/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  /*méthode localstorage de récuperation objet formulaire*/
  user: User = JSON.parse(localStorage.getItem('user') || "{}");  
  registerForm!: FormGroup;
  submitted = false;

  @Input() verifPassword: string;
  showErrorMessage: boolean = false;
  toast: any;
  defaultUserProfile: any;
  url: any;
  event: any;
  connect: any;
  userProject: any;
  projectService: any;
  language ='en'
  mySubscription: any;
  errorMessage: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    private toastService: HotToastService,
    private httpClient: HttpClient,
    private translate: TranslateService,
) {
    this.verifPassword = '';


// translate.addLangs(['en', 'fr']);

console.log(translate.getLangs());
translate.setDefaultLang(this.language);

this.router.routeReuseStrategy.shouldReuseRoute = () => false;
this.mySubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
        this.router.navigated = false;
    }
  });
}
changeLanguage(): void {
if(this.language === 'en') {
    this.language = 'fr'
} else {
    this.language = 'en'
}
this.translate.use(this.language);
}

/*function update profile*/

onSubmit(user: User): void {

    const userObserver = {
        next: (user: User) => {
            this.toastService.success('User-profile update !');
          },
      error: (err: any) => {
        this.showErrorMessage = true;
        this.errorMessage = err.error.driverError.detail;
        console.log(`Erreur edit profile : ${err.error['driverError'].detail}`);
        this.toastService.error(`Error during profile edit<br><br>${err.error.driverError.detail}`);
      },
      complete: () => {
        this.toastService.success(`User-profile edited !`);
        this.defaultUserProfile = user;
      },
    };

    this.submitted = true;
    this.userService.editUser(this.user).subscribe(userObserver)
  }

/*function selectFile*/

  onFileSelected(event: any) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
        })
    };

    const file: File = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file, this.user.id);

    //console.table(event.target.files[0]);

    this.httpClient
        .post<any>(
            'http://localhost:' +
                environment.SERVER_PORT +
                '/' +
                environment.BACKEND_URL_PROXY +
                '/users/image-upload/' +
                this.user.id,
            formData,
            httpOptions
        )
        .subscribe({
            next: (response) => {
                //console.log(response);
                this.userService
                    .getUserbyId(<string>this.user.id)
                    .subscribe({
                        next: (user: User) => {
                            this.user = user;
                        },
                        error: (err: any) => {},
                        complete: () => {}
                    });
                this.toastService.success('User picture updated !');
            },
            error: (err: any) => {
                //console.log(err.error.message);
                this.toastService.error(err.error.message);
            },
            complete: () => {}
        });
}

/*funtion ngOnInit*/

ngOnInit(): void {
    this.headerTitleService.setTitle('InfraScrum');
    console.log(this.user.role.name)}
}
    
    

