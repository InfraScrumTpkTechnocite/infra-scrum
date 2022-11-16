import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tasks-history',
    templateUrl: './tasks-history.component.html',
    styleUrls: ['./tasks-history.component.css']
})
export class TasksHistoryComponent implements OnInit {
    isTaskReduced: boolean = true;

    // @Input() kanbanList: any

    constructor() {}

    ngOnInit(): void {}

    getTaskOverview() {
        this.isTaskReduced = !this.isTaskReduced;
    }
}
