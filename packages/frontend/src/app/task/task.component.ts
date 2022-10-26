import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskAssignment } from '../models/taskassignment.model';
import { User } from '../models/user.model';
import { TaskassignmentService } from '../services/taskassignment.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    dateToday: number = Date.now();

    isTaskOverview: boolean = false;

    @Input() task!: Task;
    taskassignmentList!: TaskAssignment[];

    constructor(
        private taskassignmentService: TaskassignmentService
    ) {}

    ngOnInit(): void {
        this.taskassignmentService.findAllUsersOfTask(this.task.id!).subscribe((taskassignmentList: TaskAssignment[]) => this.taskassignmentList = taskassignmentList)
    }

    toggleTaskOverview() {
        this.isTaskOverview = !this.isTaskOverview;
    }
}
