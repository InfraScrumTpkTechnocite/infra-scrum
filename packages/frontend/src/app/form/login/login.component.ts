import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  profileForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

    constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    // console.log(`username : ${this.profileForm.controls.username.value}`);
    // console.log(`password : ${this.profileForm.controls.password.value}`);

    localStorage.removeItem('jwt-token');//force token delete

    if(this.profileForm.controls.username.value && this.profileForm.controls.password.value)
    this.authService.login(
      this.profileForm.controls.username.value,
      this.profileForm.controls.password.value
      ).subscribe(data => console.log('authlogin OK'));
     this.authService.isLoggedIn = true;
  }

}
