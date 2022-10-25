import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { User } from 'src/app/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Role } from 'c:/Users/szmul/Desktop/Infrascrum/infra-scrum/packages/frontend/src/app/models/role.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent{

  /*méthode localstorage de récuperation objet formulaire*/
  user: User = JSON.parse(localStorage.getItem('user') || "{}");

  @Input() verifPassword: string | undefined;
  showErrorMessage: boolean = false;
  toast: any;
  toastService: any;
  defaultUserProfile: any;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private headerTitleService: HeaderTitleService
) {
    this.verifPassword = '';
}

/*function update profile*/

onFormSubmit(user: User): void {

    const userObserver = {
      error: (err: any) => {
        console.log(`Erreur édition user : ${err.error['driverError'].detail}`);
        this.toastService.error(`Error during user creation<br><br>${err.error.driverError.detail}`);
  
        this.toast.success('Update user-profile!');
      },
      complete: () => {
        this.toastService.success(`User-profile edited !`);
        this.defaultUserProfile = user.userprofile;
      },
    };

    this.userService.updateUserProfile(this.user).subscribe(userObserver)
  }

/*function delete profile*/

resetForm(form: NgForm) {
	form.resetForm();
  this.user.role.name = 'delete data profile';
}

/*funtion ngOnInit*/

ngOnInit(): void {
    this.headerTitleService.setTitle('InfraScrum');
    console.log(this.user.role.name)}
}


