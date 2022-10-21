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
    paramsObject: any;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.queryParamMap
        .subscribe((params) => {
            this.paramsObject = { ...params.keys, ...params };
            console.log(this.paramsObject);
        }
        );
    }

    openSprintBar() {
        this.isSprintsOpen = true;
    }
    closeSprintBar() {
        this.isSprintsOpen = false;
    }
}
