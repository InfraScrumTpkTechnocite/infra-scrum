import { Component, Input, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user-overview',
    templateUrl: './user-overview.component.html',
    styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {

    @Input() user!: User;
    @Input() roleList!: Role[];

    defaultRole!: Role;
    
    constructor(
        private userService: UserService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.defaultRole = this.user.role;
    }

    compareByName(roleUser: Role, roleOption: Role): boolean {
        return roleUser?.id === roleOption?.id;
    }

    setRole(user: User): void {
        const observer = {
            error: (err: any) => {
                console.log(`Erreur édition user : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during user creation<br><br>${err.error.driverError.detail}`);
            },
            complete: () => {
                this.toastService.success(`User's role edited !`);
                this.defaultRole = user.role;
            }
        };
        this.userService.editUser(user).subscribe(observer);
    }
}
