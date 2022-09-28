import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent{
  
  user: User = new User();
  @Input() verifPassword: string;
  
  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.verifPassword = ""
  }

  onSubmit() {
    this.userService.createUser(this.user).subscribe(
      (user: User) => {
        if(user) this.router.navigate(['/login'])
      });
  }
}

