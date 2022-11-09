import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { User } from 'src/app/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent{

  registerForm!: FormGroup;
  submitted = false;

  /*méthode localstorage de récuperation objet formulaire*/
  user: User = JSON.parse(localStorage.getItem('user') || "{}");

  @Input() verifPassword: string | undefined;
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
    private roleService: RoleService,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    private toastService: HotToastService,
    private httpClient: HttpClient,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
) {
    this.verifPassword = '';


// translate.addLangs(['en', 'fr']);

console.log(translate.getLangs());
translate.setDefaultLang(this.language);

this.router.routeReuseStrategy.shouldReuseRoute = () => false;
this.mySubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
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
      error: (err: any) => {
        this.showErrorMessage = true;
        this.errorMessage = err.error.driverError.detail;
        console.log(`Erreur edit profile : ${err.error['driverError'].detail}`);
        this.toast.error(`Error during profile edit<br><br>${err.error.driverError.detail}`);
      },
      complete: () => {
        this.toastService.success(`User-profile edited !`);
        this.defaultUserProfile = user;
      },
    };

    this.submitted = true;
    this.userService.editUser(this.user).subscribe(userObserver)
  }




/*function "ajouter" avatar profile*/

onSelectFile(event:any) {

    const userObserver = {
      complete: () => {
        this.toastService.success(`Avatar added !`);
        this.defaultUserProfile = this.user;
      },
    };

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        this.url = event.target?.result;
      }
    }
    this.userService.editUser(this.user).subscribe(userObserver)
  }
    
/*function delete profile*/

onDeleteSubmit(user: User): void {

  const userObserver = {
    error: (err: any) => {
      console.log(`Erreur delete profile : ${err.error['driverError'].detail}`);
      this.toastService.error(`Error during profile delete<br><br>${err.error.driverError.detail}`);
  
      this.toast.success('Profile data deleted');
      },
      complete: () => {
        this.toastService.success(`Profile data deleted!`);
        this.defaultUserProfile = user;
      },
    };

    this.userService.editUser(this.user).subscribe(userObserver)
  }

/*funtion ngOnInit*/

ngOnInit(): void {
    this.headerTitleService.setTitle('InfraScrum');
    console.log(this.user.role.name)}
}
    
    

