import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    @Input() user: User = new User();

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
        private toastService: HotToastService,
        private router: Router
    ) {}

    ngOnInit(): void { 
        let user: any = localStorage.getItem('user');
        this.user = JSON.parse(user);
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
                this.router.navigate([this.router.url]);
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
