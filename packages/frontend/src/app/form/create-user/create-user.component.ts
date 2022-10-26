import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  user: User = new User();
  @Input() verifPassword: string;
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  constructor(
      private userService: UserService,
      private roleService: RoleService,
      private router: Router,
      private headerTitleService: HeaderTitleService,
      private toast: HotToastService,
  ) {
      this.verifPassword = '';
  }

  ngOnInit(): void {
      this.headerTitleService.setTitle('InfraScrum');
  }

  onSubmit() {
    const userObserver = {
      next: (user: User) => {
        //if(user) this.router.navigate(['/login']);
        this.toast.success('User created ! User needs to be activated.');
      },
      error: (err: any) => {
        this.showErrorMessage = true;
        this.errorMessage = err.error.driverError.detail;
        console.log(`Erreur création user : ${err.error['driverError'].detail}`);
        this.toast.error(`Error during user creation<br><br>${err.error.driverError.detail}`);
      },
      complete: () => {
        console.log(`create-user - onSubmit - createuser terminé.`)
      },
    };

    const roleObserver = {
      next: (role: Role) => {
        this.user.role = role;
        this.userService.createUser(this.user).subscribe(userObserver);
      },
      error: (err: Error) => {
        console.log(`Erreur récupération role : ${err}`);
      },
      complete: () => {
        console.log(`create-user - onSubmit - get role terminé.`)
      },
    };
  
    this.roleService.getRoleByName("guest").subscribe(roleObserver);
  }
}