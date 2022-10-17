import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { UserProject } from '../models/userproject.model';
import { HeaderTitleService } from '../services/header-title.service';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { UserprojectService } from '../services/userproject.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
    isEditNewProject: boolean = false;

    dateToday: number = Date.now();
    userProjects: any;

    selectedPictureFile: File | null = null;
    showErrorMessage: boolean = false;
    errorMessage:string = '';

    constructor(private headerTitleService: HeaderTitleService,
        private userProjectService: UserprojectService,
        private userService: UserService,
        private projectService: ProjectService,
        private toastService: HotToastService) { }

    ngOnInit(): void {
        this.headerTitleService.setTitle('My projects');

        //exemple pour récupérer les projets d'un user...
        const userProjectsObserver = {
            next: (value: any) => {
                this.userProjects = value;//tous les user-projects (contenants toutes les infos du projet)
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
            },
        };
        //...et attention : le userid n'est certainement pas le bon !
        //this.userProjectService.findUserProjects('32e5d252-51ea-48d6-aed3-a8cd4bf06e90').subscribe(userProjectsObserver);

        const userObserver = {
            next: (response: User) => {
                localStorage.setItem('user', JSON.stringify(response));
                //pour lire le localStorage : 
                //var user = JSON.parse(localStorage.getItem('user'));
                if (response.id) this.userProjectService.findCurrentUserProjects(response.id).subscribe(userProjectsObserver);
            },
            error: (err: Error) => {
                console.log(`Error: ${err}`);
            },
            complete: () => {
                console.log(`login.component.ts - get user completed.`);
            }
        }
        //console.log(`login.component.ts - onSubmit - token=${localStorage.getItem('jwt-token')}`);
        var username = localStorage.getItem('username');
        if (username) this.userService.findUserByUsername(username).subscribe(userObserver);
    }
    
    addProject() {
        const newProject = new Project();
        
        const projectObserver = {
            next: (project: Project) => {
                var userProject = new UserProject()
                userProject.project = project;
                userProject.user = JSON.parse( localStorage.getItem('user') || "")?.id;
                userProject.isprojectadmin = true;
                this.userProjectService.create(userProject).subscribe(userProjectObserver);
            },
            error: (err: any) => {
                this.showErrorMessage = true;
                this.errorMessage = err.error.driverError.detail;
                console.log(`Erreur création projet : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during project creation<br><br>${err.error.driverError.detail}`);
            },
            complete: () => {
                console.log(`projects.component.ts - add project completed.`);
            }
        }

        const userProjectObserver = {
            next: (userProject: any) => {
                this.userProjectService.findCurrentUserProjects(userProject.user).subscribe(
                    (userProjects: UserProject[]) => {
                        this.userProjects = userProjects;
                    })
            },
            error: (err: any) => {
                this.showErrorMessage = true;
                this.errorMessage = err.error.driverError.detail;
                console.log(`Erreur création user_projet : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during user_project creation<br><br>${err.error.driverError.detail}`);
            },
            complete: () => {
                console.log(`projects.component.ts - add userproject completed.`);
                this.toastService.success("New Project created !");
            }
        }

        this.projectService.create(newProject).subscribe(projectObserver);
    }
}
