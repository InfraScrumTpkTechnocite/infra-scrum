import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
    isEditNewProject: boolean = false;

    dateToday: number = Date.now();

    constructor(private headerTitleService: HeaderTitleService) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('My projects');
    }

    editProjectModel() {
        this.isEditNewProject = !this.isEditNewProject;
    }
}
