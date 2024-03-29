import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { UserProject } from '../models/userproject.model';
import { ProjectService } from '../services/project.service';

@Component({
    selector: 'app-projectinfo',
    templateUrl: './projectinfo.component.html',
    styleUrls: ['./projectinfo.component.css']
})
export class ProjectinfoComponent {
    @Input() userProject!: UserProject;
    @Input() user: User = new User();

    isEditNewProject: boolean = false;
    showErrorMessage: boolean = false;
    errorMessage: string = '';
    userProjects: any;
    project: any;

    constructor(
        private projectService: ProjectService,
        private toastService: HotToastService,
        private router: Router,
        private httpClient: HttpClient
    ) {}

    ngOnInit(): void {
        let user: any = localStorage.getItem('user');
        this.user = JSON.parse(user);
    }

    openEditionProject() {
        this.isEditNewProject = true;
    }

    updateProjectModel(projectForm: any) {
        // console.log(
        //     `projectinfo.component - updateProjectModel - form = ${JSON.stringify(
        //         projectForm.value
        //     )}`
        // );

        // console.log(
        //     `project name = ${this.userProject.project.name}, projet id = ${this.userProject.project.id}`
        // );

        const projectObserver = {
            next: (updateresponse: any) => {
                // console.log(
                //     `projectinfo.component - updateProjectModel - update row affected = ${updateresponse.affected}`
                // );
                this.router.navigate([this.router.url]); //reload header component !
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
                // console.log(`projects.component.ts - edit project completed.`);
                this.toastService.success('Project edited !');
            }
        };
        // console.warn(this.userProject);

        delete this.userProject.project.picture; //no need to update (if any new picture, it's already been posted by upload)
        this.projectService
            .update(this.userProject.project)
            .subscribe(projectObserver);

        this.isEditNewProject = false;
    }

    userProjectClicked(event: any) {
        this.router.navigate(['/project'], {
            queryParams: { projectid: this.userProject.project.id }
        });
    }

    onFileSelected(event: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
            })
        };

        const file: File = event.target.files[0];
        const formData = new FormData();

        formData.append('file', file, this.userProject.project.id);

        //console.table(event.target.files[0]);

        this.httpClient
            .post<any>(
                'http://localhost:' +
                    environment.SERVER_PORT +
                    '/' +
                    environment.BACKEND_URL_PROXY +
                    '/projects/image-upload/' +
                    this.userProject.project.id,
                formData,
                httpOptions
            )
            .subscribe({
                next: (response) => {
                    //console.log(response);//should be : null...
                    //...anyway, we only have to know that POST was successful...
                    // ...and go and get the new version of the user project which contains the new picture !
                    this.projectService
                        .findOne(<string>this.userProject.project.id)
                        .subscribe({
                            next: (project: Project) => {
                                this.userProject.project = project;
                            },
                            error: (err: any) => {},
                            complete: () => {}
                        });
                    this.toastService.success('Project picture updated !');
                },
                error: (err: any) => {
                    //console.log(err.error.message);
                    this.toastService.error(err.error.message);
                },
                complete: () => {}
            });
    }
}
