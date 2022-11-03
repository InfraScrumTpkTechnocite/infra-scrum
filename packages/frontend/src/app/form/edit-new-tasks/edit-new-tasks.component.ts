import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskAssignment } from '../../models/taskassignment.model';
import { Task } from '../../models/task.model';
import { TaskType } from 'src/app/models/tasktype.model';
import { TaskService } from 'src/app/services/task.service';
import { Project } from 'src/app/models/project.model';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'app-edit-new-tasks',
    templateUrl: './edit-new-tasks.component.html',
    styleUrls: ['./edit-new-tasks.component.css']
})
export class EditNewTasksComponent implements OnInit {
    constructor(
        private taskService: TaskService,
        private toastService: HotToastService,
        public dialogRef: MatDialogRef<EditNewTasksComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            task: Task;
            taskassignmentList: TaskAssignment[];
            taskTypeList: TaskType[];
            sprintList: Project[];
            edition: boolean;
        }
    ) {}
    newTask: Task = this.data.task;

    taskassignmentList: TaskAssignment[] = this.data.taskassignmentList!;
    newTaskassignmentList: TaskAssignment[] = [];

    taskTypeList: TaskType[] = this.data.taskTypeList;

    sprintList: Project[] = this.data.sprintList;
    noSprint: Project = new Project();

    newDate: Date = new Date();

    ngOnInit() {
        this.taskassignmentList.map((taskassignment) =>
            this.newTaskassignmentList.push(taskassignment)
        );
        this.newDate = new Date(this.data.task?.startdate);
    }

    compareTaskType(taskType: TaskType, taskOption: TaskType): boolean {
        return taskType?.id === taskOption?.id;
    }

    compareSprint(sprint: Project, sprintOption: Project): boolean {
        return sprint?.id === sprintOption?.id;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    editTask(): void {
        const observer = {
            next: (task: Task) => {
                this.data.task = task;
                this.dialogRef.close();
            },
            error: (err: any) => {
                console.log(
                    `Erreur edition task : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during task edition<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('Task Edited !');
            }
        };
        this.newTask.startdate = this.newDate.toISOString();
        if (!this.newTask.sprint?.id) {
            this.newTask.sprint = null;
        }
        this.taskService.edit(this.newTask).subscribe(observer);
    }

    addTask(): void {
        const observer = {
            next: (task: Task) => {
                this.data.task = task;
                console.log("task from observer :",task);
                this.dialogRef.close();
            },
            error: (err: any) => {
                console.log(
                    `Erreur creation task : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during task creation<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('Task created !');
            }
        };
        this.newTask.startdate = this.newDate.toISOString();
        if (!this.newTask.sprint?.id) {
            this.newTask.sprint = null;
        }
        this.taskService.create(this.data.task).subscribe(observer);
    }
}
