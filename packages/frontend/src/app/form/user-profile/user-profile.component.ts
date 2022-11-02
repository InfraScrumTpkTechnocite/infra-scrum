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
  userProject: any;
  projectService: any;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    private toastService: HotToastService,
    private httpClient: HttpClient
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

  /*function select et update "avatar"*/

  userProfileClicked(event: any) {
    console.log(
        `userprofileinfo.component - userProfileClicked - user-profile clicked - userid = ${this.user.user.id}`
    );
    this.router.navigate(['/user'], {
        queryParams: { userid: this.user.user.id }
    });
}

onFileSelected(event: any) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
        })
    };

    const file: File = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file, this.user.user.id);

    console.table(event.target.files[0]);

    this.httpClient
        .post<any>(
            'http://localhost:4200/backend/image-upload/' +
                this.user.user.id,
            formData,
            httpOptions
        )
        .subscribe({
            next: (response) => {
                //console.log(response);
                this.projectService
                    .findOne(<string>this.user.user.id)
                    .subscribe({
                        next: (user: User) => {
                            this.user = user;
                        },
                        error: (err: any) => {},
                        complete: () => {}
                    });
                this.toastService.success('Profile picture updated !');
            },
            error: (err: any) => {
                //console.log(err.error.message);
                this.toastService.error(err.error.message);
            },
            complete: () => {}
        });
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



