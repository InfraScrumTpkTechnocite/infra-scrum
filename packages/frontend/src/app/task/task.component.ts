import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    dateToday: number = Date.now();

    isTaskOverview: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    toggleTaskOverview() {
        this.isTaskOverview = !this.isTaskOverview;
    }
}
