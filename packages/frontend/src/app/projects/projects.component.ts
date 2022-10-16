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

    selectedPictureFile: File | null = null;

    constructor(private headerTitleService: HeaderTitleService,
        private userProjectService: UserprojectService,
        private userService: UserService) { }

    ngOnInit(): void {
        this.headerTitleService.setTitle('My projects');

        //exemple pour récupérer les projets d'un user...
        const userProjectsObserver = {
            next: (value: any) => {
                this.userProjects = value;//tous les user-projects (contenants toutes les infos du projet)
                var usertmp: any = localStorage.getItem('user');
                var user: User = JSON.parse(usertmp);
                if(user) this.headerTitleService.setUsername(user);
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
                if (response.id) this.userProjectService.findUserProjects(response.id).subscribe(userProjectsObserver);
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
}
