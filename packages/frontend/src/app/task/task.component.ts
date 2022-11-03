import { Component, Input, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Task } from '../models/task.model';
import { TaskAssignment } from '../models/taskassignment.model';
import { TaskassignmentService } from '../services/taskassignment.service';
import { MatDialog } from '@angular/material/dialog';
import { EditNewTasksComponent } from '../form/edit-new-tasks/edit-new-tasks.component';
import { TaskType } from '../models/tasktype.model';
import { Project } from '../models/project.model';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    dateToday: number = Date.now();

    isTaskOverview: boolean = false;

    @Input() subject!: WebSocketSubject<any>;
    @Input() task!: Task;
    @Input() taskTypeList!: TaskType[];
    @Input() sprintList!: Project[];
    taskassignmentList!: TaskAssignment[];

    constructor(
        private taskassignmentService: TaskassignmentService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.taskassignmentService
            .findAllUsersOfTask(this.task.id!)
            .subscribe(
                (taskassignmentList: TaskAssignment[]) =>
                    (this.taskassignmentList = taskassignmentList)
            );
    }

    toggleTaskOverview() {
        this.isTaskOverview = !this.isTaskOverview;
    }

    editTask() {
        const task = this.task;
        this.dialog.open(EditNewTasksComponent, {
            data: {
                task: task,
                taskassignmentList: this.taskassignmentList,
                taskTypeList: this.taskTypeList,
                sprintList: this.sprintList,
                edition: true
            }
        });
    }
}
