import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;
    
    projectid: string = ''

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.queryParamMap
        .subscribe((params) => {
            let paramsObject: any = { ...params.keys, ...params };
            this.projectid = paramsObject.params.projectid;
            console.log(`project.component - projectid = ${this.projectid}`);
        });
    }

    openSprintBar() {
        this.isSprintsOpen = true;
    }
    closeSprintBar() {
        this.isSprintsOpen = false;
    }
}
