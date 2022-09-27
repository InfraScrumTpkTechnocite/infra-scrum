import { Component } from '@angular/core';
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
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.userService.createUser(this.user).subscribe(() => this.router.navigate(['/login']));;
  }
}
