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
import { HotToastService } from '@ngneat/hot-toast';

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
  defaultUserProfile: any;
  url: any;
  event: any;
  connect: any;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    private toastService: HotToastService,
) {
    this.verifPassword = '';
}

/*function update profile*/

onSubmit(user: User): void {

    const userObserver = {
      error: (err: any) => {
        console.log(`Erreur édition profile : ${err.error['driverError'].detail}`);
        this.toastService.error(`Error during profile creation<br><br>${err.error.driverError.detail}`);
  
        this.toast.success('Update user-profile!');
      },
      complete: () => {
        this.toastService.success(`User-profile edited !`);
        this.defaultUserProfile = user;
      },
    };

    this.userService.editUser(this.user).subscribe(userObserver)
  }

  /*function "ajouter" avatar profile*/

  onSelectFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        this.url = event.target?.result;
      }
    }
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


