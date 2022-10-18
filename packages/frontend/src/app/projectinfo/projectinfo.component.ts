import { Component, Input, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { UserProject } from '../models/userproject.model';
import { HeaderTitleService } from '../services/header-title.service';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { UserprojectService } from '../services/userproject.service';

@Component({
    selector: 'app-projectinfo',
    templateUrl: './projectinfo.component.html',
    styleUrls: ['./projectinfo.component.css']
})
export class ProjectinfoComponent {
    @Input() userProject!: UserProject;
    isEditNewProject: boolean = false;
    // selectedPictureFile?: File;
    showErrorMessage: boolean = false;
    errorMessage: string = '';
    userProjects: any;

    constructor(
        private headerTitleService: HeaderTitleService,
        private userProjectService: UserprojectService,
        private userService: UserService,
        private projectService: ProjectService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        const userProjectsObserver = {
            next: (value: any) => {
                this.userProjects = value; //tous les user-projects (contenants toutes les infos du projet)
                this.headerTitleService.setUserProjects(value);
                var usertmp: any = localStorage.getItem('user');
                var user: User = JSON.parse(usertmp);
                if (user) this.headerTitleService.setUsername(user);
            },
            error: (err: Error) => {
                console.log(`${err}`);
            },
            complete: () => {
                console.log(`get user's projects completed.`);
            }
        };

        const userObserver = {
            next: (response: User) => {
                localStorage.setItem('user', JSON.stringify(response));

                if (response.id)
                    this.userProjectService
                        .findCurrentUserProjects(response.id)
                        .subscribe(userProjectsObserver);
            },
            error: (err: Error) => {
                console.log(`Error: ${err}`);
            },
            complete: () => {
                console.log(`login.component.ts - get user completed.`);
            }
        };

        var username = localStorage.getItem('username');
        if (username)
            this.userService
                .findUserByUsername(username)
                .subscribe(userObserver);
    }

    openEditionProject() {
        this.isEditNewProject = true;
    }

    updateProjectModel() {
        console.log(
            `project name = ${this.userProject.project.name}, projet id = ${this.userProject.project.id}`
        );

        const projectObserver = {
            next: (project: Project) => {
                console.log('project edition');
            },
            error: (err: any) => {
                this.showErrorMessage = true;
                this.errorMessage = err.error.driverError.detail;
                console.log(
                    `Erreur édition projet : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during project edition <br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                console.log(`projects.component.ts - edit project completed.`);
                this.toastService.success('Project edited !');
            }
        };
        // console.warn(this.userProject);

        this.projectService
            .update(this.userProject.project)
            .subscribe(projectObserver);

        this.isEditNewProject = false;
    }

    // onFileSelected(event: any) {
    //     this.selectedPictureFile = event.target.files[0];
    //     console.log(
    //         `Selected picture file : ${this.selectedPictureFile?.name}`
    //     );
    // }
}
