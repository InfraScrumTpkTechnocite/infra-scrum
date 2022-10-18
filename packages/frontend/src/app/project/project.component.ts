import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    openSprintBar() {
        this.isSprintsOpen = true;
    }
    closeSprintBar() {
        this.isSprintsOpen = false;
    }
}
