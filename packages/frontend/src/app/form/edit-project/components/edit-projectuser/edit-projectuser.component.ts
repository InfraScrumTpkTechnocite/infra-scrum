import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from '../../../../models/user.model';
import { UserProject } from '../../../../models/userproject.model';
import { UserprojectService } from '../../../../services/userproject.service';

@Component({
    selector: 'app-edit-projectuser',
    templateUrl: './edit-projectuser.component.html',
    styleUrls: ['./edit-projectuser.component.css']
})
export class EditProjectuserComponent implements OnInit {
    @Input() projectid!: string;
    @Input() user!: User;
    @Input() userProjectList!: UserProject[];

    isAssigned: boolean = false;
    isAdmin: boolean = false;
    userProject: any;

    constructor(
        private userProjectService: UserprojectService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        // this.total_users_assigned = this.userProjectList.filter(
        //     (userProject) => userProject
        // ).length;
        console.log(
            `edit-EditProjectuserComponent.component - ngOnInit - total users : ${this.userProjectList.length}`
        );

        this.userProject = this.userProjectList!.find(
            (userProject) => this.user.id == userProject.user.id
        );

        if (this.userProject) {
            this.isAssigned = true;
            this.isAdmin = this.userProject.isprojectadmin;
        } else {
            this.isAssigned = false;
            this.isAdmin = false;
        }
    }

    assignUserToProject() {
        const assignObserver = {
            next: (userProject: UserProject) => {
                this.userProjectList.push(userProject);
                // this.total_users_assigned = this.userProjectList.filter(
                // (userProject) => userProject
                // ).length;
                console.log(
                    `edit-EditProjectuserComponent.component - ngOnInit - total users : ${this.userProjectList.length}`
                );
            },
            error: (err: any) => {
                console.log(
                    `Erreur création userProject : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during userProject creation<br><br>${err.error.driverError.detail}`
                );
                this.isAssigned = false;
            },
            complete: () => {
                this.toastService.success(
                    `User is now assigned to the project !`
                );
            }
        };

        const desassignObserver = {
            next: (userProject: UserProject) => {
                this.userProjectList.splice(
                    this.userProjectList.findIndex(
                        (userProjectInList) =>
                            userProjectInList.id == userProject.id
                    ),
                    1
                );
                console.log(
                    `edit-EditProjectuserComponent.component - ngOnInit - total users : ${this.userProjectList.length}`
                );
            },
            error: (err: any) => {
                console.log(
                    `Erreur delete userProject : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during userProject deletion<br><br>${err.error.driverError.detail}`
                );
                this.isAssigned = true;
            },
            complete: () => {
                this.toastService.warning(
                    `User is now desassigned of the project !`
                );
            }
        };

        var newUserProject = new UserProject();
        if (this.isAssigned) {
            newUserProject.project.id = this.projectid;
            newUserProject.user = this.user;
            this.userProjectService
                .create(newUserProject)
                .subscribe(assignObserver);
        } else {
            const userProject = this.userProjectList.find(
                (userProject) => userProject.user.id == this.user.id
            );

            if (this.userProjectList.length > 1) {
                if (userProject && !userProject.isprojectadmin) {
                    if (this.user.id == userProject.user.id)
                        this.userProjectService
                            .delete(userProject.id!)
                            .subscribe(desassignObserver);
                } else {
                    this.toastService.error(
                        "Admin of project can't be desassigned !"
                    );
                    this.isAssigned = true;
                    console.log('should be true', this.isAssigned);
                }
            } else {
                this.isAssigned = true;
                this.toastService.warning(
                    `There must be at least one user assigned to project !`
                );
            }
        }
    }

    setUserProjectAdmin() {
        const userProject: any = this.userProjectList.find(
            (userProject) => userProject.user.id == this.user.id
        );
        const setUserProjectAdmin = {
            next: (userProject: UserProject) => {
                console.log(`UserProject updated !`);
            },
            error: (err: any) => {
                console.log(
                    `Erreur mise à jour userProject : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during userProject creation<br><br>${err.error.driverError.detail}`
                );
                this.isAssigned = false;
            },
            complete: () => {
                if (this.isAdmin) {
                    this.toastService.success(`User is now project admin !`);
                } else
                    this.toastService.warning(
                        `User is not project admin anymore !`
                    );
            }
        };

        if (userProject) {
            userProject.isprojectadmin = this.isAdmin;
            this.userProjectService
                .update(userProject.id, userProject)
                .subscribe(setUserProjectAdmin);
        }
    }

    // ngOnChanges() {
    //     alert('ngonchange');
    // }

    // ngDoCheck() {
    //     alert('ngdocheck');
    // }
}
