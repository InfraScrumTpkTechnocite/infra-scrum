import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
    constructor(private headerTitleService: HeaderTitleService) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('My projects');
    }
}
