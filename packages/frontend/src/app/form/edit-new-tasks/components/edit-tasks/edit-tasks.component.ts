import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskAssignment } from 'src/app/models/taskassignment.model';
import { Task } from 'src/app/models/task.model';
import { TaskType } from 'src/app/models/tasktype.model';
import { TaskService } from 'src/app/services/task.service';
import { Project } from 'src/app/models/project.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UserProject } from 'src/app/models/userproject.model';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
    selector: 'app-edit-tasks',
    templateUrl: './edit-tasks.component.html',
    styleUrls: ['./edit-tasks.component.css']
})
export class EditTasksComponent implements OnInit {
    @Input() data!: any;
    newTask! : Task
    sprintList!: Project[] 
    @Input() taskassignmentList!: TaskAssignment[];
    @Input() userProjectList!: UserProject[];
    @Input() taskTypeList!: TaskType[];
    noType: TaskType = new TaskType();
    noSprint: Project = new Project();

    newDate: Date = new Date();

    days!: number;
    hours!: number;
    minutes!: number;

    edition: boolean = false;

    constructor(
        private taskService: TaskService,
        private taskAssignmentService: TaskassignmentService,
        private toastService: HotToastService,
        public dialogRef: MatDialogRef<EditTasksComponent>
        
    ) {
        
        
    }
    
    ngOnInit() {
        this.newDate = new Date(this.data.task?.startdate);
        this.taskTypeList = this.data.taskTypeList;
        this.sprintList = this.data.sprintList;
        this.newTask = new Task(this.data.task);
        this.minutes = this.newTask.estimatedtime % 60;
        this.hours = Math.floor(
            ((this.newTask.estimatedtime - this.minutes) / 60) % 8
        );
        this.days = Math.floor(
            (this.newTask.estimatedtime - this.hours - this.minutes) / 480
        );

    }

    isUserAssigned(userProject: UserProject): boolean {
        if (
            this.taskassignmentList.find(
                (taskAssignment) =>
                    taskAssignment.userproject.id == userProject.id
            )
        )
            return true;
        return false;
    }

    compareTaskType(taskOption: TaskType, taskType: TaskType): boolean {
        return taskType?.id === taskOption?.id;
    }

    compareSprint(sprintOption: Project, sprint: Project): boolean {
        if (!sprint && sprintOption == new Project()) {
            return true;
        }
        return sprint?.id === sprintOption?.id;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addUser(userProject: UserProject): void {
        const newAssignement = new TaskAssignment(userProject, this.data.task);
        const observer = {
            error: (err: any) => {
                console.log(
                    `Erreur creation taskassignment : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during taskassignment creation<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success('Task Assigned !');
                this.taskassignmentList.push(newAssignement);
            }
        };
        this.taskAssignmentService.create(newAssignement).subscribe(observer);
    }

    addOrEditTask(edition: boolean): void {
        this.newTask.startdate = new Date(this.newDate).toISOString();
        this.newTask.estimatedtime =
            this.days * 480 + this.hours * 60 + this.minutes;
        if (edition) {
            const observer = {
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
                    this.data.subject.next({
                        method: 'edit',
                        task: this.newTask
                    });
                    this.dialogRef.close({
                        task: this.newTask,
                        taskid: this.data.task.id
                    });
                }
            };
            if (!this.newTask.sprint?.id) {
                this.newTask.sprint = null;
            }
            console.log(this.data.subject);
            this.taskService
                .edit(this.data.task.id!, this.newTask)
                .subscribe(observer);
        } else {
            const observer = {
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
                    console.log(this.data.subject);
                    this.data.subject.next({
                        method: 'add',
                        task: this.newTask
                    });
                    this.dialogRef.close({
                        task: this.newTask,
                        taskid: this.data.task.id
                    });
                }
            };
            this.newTask.startdate = this.newDate.toISOString();
            if (!this.newTask.sprint?.id) {
                this.newTask.sprint = null;
            }
            this.taskService.create(this.data.task).subscribe(observer);
        }
    }

    removeUser(taskAssignment: TaskAssignment): void {
        console.log('task assignment:', taskAssignment);
        this.taskassignmentList.splice(
            this.taskassignmentList.findIndex((tskAssignment) => {
                taskAssignment.id == tskAssignment.id;
            }),
            1
        );

        this.taskAssignmentService.delete(taskAssignment.id!).subscribe({
            next: () => {
                console.log(`User unassigned from task`);
            },
            error: () => {},
            complete: () => {}
        });
    }

}
