import { Component, Input, OnInit } from '@angular/core';
import { KanbanList } from 'src/app/models/kanbanlist.model';

@Component({
    selector: 'app-tasks-history',
    templateUrl: './tasks-history.component.html',
    styleUrls: ['./tasks-history.component.css']
})
export class TasksHistoryComponent implements OnInit {
    isTaskReduced: boolean = true;
    tasksLists: any = [];
    projectTasks = [];

    @Input() kanbanList!: KanbanList[];

    constructor() {}

    ngOnInit(): void {
        this.kanbanList.forEach((knbn) => {
            this.tasksLists = this.tasksLists.concat(knbn.tasks);
        });
        this.tasksLists.sort(function (task1: any, task2: any) {
            return (
                new Date(task2.startdate).getTime() -
                new Date(task1.startdate).getTime()
            );
        });
    }
}
