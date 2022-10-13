import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
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
    userRoleList: Array<any> = [];
    showErrorMessage: boolean = false;
    errorMessage: string = '';

    constructor(
        private headerTitleService: HeaderTitleService,
        private userService: UserService,
        private roleService: RoleService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        const observer = { 
            next : (userList : User[]) => {
                this.userList = userList;
            },
            complete : () => {
                this.userList.map(user => {
                    this.userRoleList.push({
                        userId: user.id,
                        roleId: user.role.id});
                });
            }
        };

        this.headerTitleService.setTitle('Administration');

        this.userService.getAllUsers().subscribe(observer);

        this.roleService.getAllRoles().subscribe(
            roleList => this.roleList = roleList
            );
    }

    compareByName(roleUser: Role, roleOption: Role): boolean{
        return roleUser.id === roleOption.id;
    }
    
    setRole(user: User): void{
        const observer = { 
            error : (err : any) => {
                this.showErrorMessage = true;
                this.errorMessage = err.error.driverError.detail;
                console.log(`Erreur édition user : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during user creation<br><br>${err.error.driverError.detail}`);
            },
            complete : () => {
                this.toastService.success(`User's role edited !`);
            }
        };
        this.userService.editUser(user).subscribe(observer);
    }
}
