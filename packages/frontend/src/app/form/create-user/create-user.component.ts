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
    let roleid;
    let router = this.router;

    this.roleService.getRoleByName('guest').subscribe({
      next(value) {
        roleid = value.id;
        console.log(`create-user-onSubmit role = ${value.id} ${value.name}`)    
      },
      error(err) {
        
      },
      complete() {
        
      },
    })
    
    this.user.role = roleid;

    this.userService.createUser(this.user).subscribe(
      {
        next(value) {
          roleid = value.id;
          console.log(`create-user-onSubmit role = ${value.id} ${value.username}`); 
          router.navigate(['/login']); //==> return to login when user created
        },
        error(err) {
          
        },
        complete() {
        },
      })   
  }
}