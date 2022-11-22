import { Component, Inject} from '@angular/core';
import { UserProject } from '../../models/userproject.model';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent{
    projectid!: string;
    project: Project = this.data.project;
    userList: User[] = this.data.userList;
    userProjectList: UserProject[] = this.data.userProjectList;
    sprintList: Project[] = this.data.sprintList;
    switch: string = 'default';

    constructor(
        private projectService: ProjectService,
        private dialogRef: MatDialogRef<EditProjectComponent>,
        private toastService: HotToastService,
        @Inject(MAT_DIALOG_DATA)
        private data: {
            project: Project,
            userProjectList: UserProject[],
            userList: User[],
            sprintList: Project[]
        }
    ) {}

    editProject() {
        const observer = {
            error: (err: any) => {
                console.log(
                    `Erreur edition project : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during project edition<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('Project Edited !');
                this.dialogRef.close({
                    project: this.project
                });
            }
        };
        delete this.project.picture; //no need to update (if any new picture, it's already been posted by upload)
        this.projectService.update(this.project).subscribe(observer);
    }

    closeWindow(){
        this.dialogRef.close();
    }
}
