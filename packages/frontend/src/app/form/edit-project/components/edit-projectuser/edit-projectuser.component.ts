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

    isAssigned:boolean = false;
    isAdmin:boolean = false;

    constructor(
        private userProjectService: UserprojectService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        const userProject = this.userProjectList!.find(userProject => this.user.id == userProject.user.id )
        if(userProject) {
            this.isAssigned = true;
            this.isAdmin= userProject.isprojectadmin;
        }
        else this.isAssigned = false;
    }

    assignUserToProject(){
        const assignObserver = {
            next:(userProject: UserProject) => {
                this.userProjectList.push(userProject);
            },
            error: (err: any) => {
                console.log(`Erreur création userProject : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during userProject creation<br><br>${err.error.driverError.detail}`);
                this.isAssigned = false;
            },
            complete: () => {
                this.toastService.success(`User is now assigned to the project !`);
            }
        };

        const desassignObserver = {
            next:(userProject: UserProject) => {
                this.userProjectList.splice(this.userProjectList.findIndex(userProjectInList => userProjectInList.id == userProject.id ),1,);
            },
            error: (err: any) => {
                console.log(`Erreur delete userProject : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during userProject deletion<br><br>${err.error.driverError.detail}`);
                this.isAssigned = true;
            },
            complete: () => {
                this.toastService.success(`User is now desassigned of the project !`);
            }
        };

        var newUserProject = new UserProject();
        if(this.isAssigned) {
            newUserProject.project.id = this.projectid;
            newUserProject.user = this.user;
            this.userProjectService.create(newUserProject).subscribe(assignObserver);
        }
        else {
            const userProject = this.userProjectList.find(userProject => this.user.id == userProject.user.id) 
            if(userProject && !userProject.isprojectadmin){
                if(this.user.id == userProject.user.id) this.userProjectService.delete(userProject.id!).subscribe(desassignObserver);
            }
            else{
                this.toastService.error("Admin of project can't be desassigned !");
                this.isAssigned = true
                console.log("should be true",this.isAssigned)
            }
        }
    }
}
