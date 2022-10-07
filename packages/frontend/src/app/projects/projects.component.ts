import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HeaderTitleService } from '../services/header-title.service';
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

    constructor(private headerTitleService: HeaderTitleService,
        private userProjectService: UserprojectService,
        private userService: UserService) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('My projects');

        //exemple pour récupérer les projets d'un user...
        const userProjectsObserver = {
            next: (value: any) => {
                this.userProjects = value;
                this.userProjects.forEach((userproject: { id: string, isprojectadmin: boolean, project: { name: string; }; }) => {
                    //console.log(`id: ${userproject.id}, projet : ${userproject.project.name}, isprojectadmin : ${userproject.isprojectadmin}`);
                    console.table(userproject.project);
                });
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
                if(response.id) this.userProjectService.findUserProjects(response.id).subscribe(userProjectsObserver);
            },
            error: (err: Error) => {
                console.log(`Error: ${err}`);
            },
            complete: () => {
                console.log(`login.component.ts - get user completed.`);
            }
        }
        console.log(`login.component.ts - onSubmit - token=${localStorage.getItem('jwt-token')}`);
        this.userService.findUserByUsername('gilles').subscribe(userObserver);

    }

    editProjectModel() {
        this.isEditNewProject = !this.isEditNewProject;
    }
}
