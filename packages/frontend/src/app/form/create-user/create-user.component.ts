import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';
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
        private router: Router,
        private headerTitleService: HeaderTitleService
    ) {
        this.verifPassword = '';
    }
    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');
    }

    onSubmit() {
        this.userService.createUser(this.user).subscribe((user: User) => {
            if (user) this.router.navigate(['/login']);
        });
    }
}
