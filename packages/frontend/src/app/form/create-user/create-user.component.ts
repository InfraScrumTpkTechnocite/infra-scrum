import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  user: User = new User();
  @Input() verifPassword: string;
  showErrorMessage: boolean = false;

  constructor(
      private userService: UserService,
      private roleService: RoleService,
      private router: Router,
      private headerTitleService: HeaderTitleService
  ) {
      this.verifPassword = '';
  }
  ngOnInit(): void {
      this.headerTitleService.setTitle('InfraScrum');
  }

  onSubmit() {
    const userObserver = {
      next: (user: User) => {
        if(user) this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.showErrorMessage = true;
        console.log(`Erreur création user : ${err}`);
      },
      complete: () => {
        console.log(`create-user - onSubmit - createuser terminé.`)
      },
    };

    const roleObserver = {
      next: (roleid: any) => {
        this.user.role = roleid;
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