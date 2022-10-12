import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    
    userList: User[] = [];
    roleList: Role[] = [];

    constructor(
        private headerTitleService: HeaderTitleService,
        private userService: UserService,
        private roleService: RoleService,    
    ) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('Administration');

        this.userService.getAllUsers().subscribe(
            userList => this.userList = userList );

        this.roleService.getAllRoles().subscribe(
            roleList => this.roleList = roleList
            );
    }

    compareByName(roleUser: Role, roleOption: Role): boolean{
        return roleUser.id === roleOption.id;
    }
    
    setRole(user: User): void{
        this.userService.editUser(user).subscribe(() => console.log("role edited"));
    }
}
