import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskAssignment } from '../../models/taskassignment.model';
import { Task } from '../../models/task.model';
import { TaskType } from 'src/app/models/tasktype.model';
import { TaskService } from 'src/app/services/task.service';
import { Project } from 'src/app/models/project.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UserProject } from 'src/app/models/userproject.model';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Kanbanstatus } from 'src/app/models/kanbanstatus.model';
import { User } from 'src/app/models/user.model';

interface KanbanList {
    kanban: Kanbanstatus;
    tasks: Task[];
}

@Component({
    selector: 'app-edit-new-tasks',
    templateUrl: './edit-new-tasks.component.html',
    styleUrls: ['./edit-new-tasks.component.css']
})
export class EditNewTasksComponent implements OnInit {
    newTask: Task = new Task(this.data.task);

    taskassignmentList: TaskAssignment[] = this.data.taskassignmentList ?? [];
    userProjectList: UserProject[] = this.data.userProjectList;

    noType: TaskType = new TaskType();

    noSprint: Project = new Project();

    noKanban: Kanbanstatus = new Kanbanstatus();

    newDate: Date = new Date();

    days: number;
    hours: number;
    minutes: number;

    edition: boolean = false;

    constructor(
        private taskService: TaskService,
        private taskAssignmentService: TaskassignmentService,
        private toastService: HotToastService,
        public dialogRef: MatDialogRef<EditNewTasksComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            task: Task;
            taskassignmentList: TaskAssignment[];
            userProjectList: UserProject[];
            taskTypeList: TaskType[];
            sprintList: Project[];
            edition: boolean;
            subject: WebSocketSubject<unknown>;
            kanbanList: KanbanList[];
            user: User;
        }
    ) {
        this.minutes = this.newTask.estimatedtime % 60;
        this.hours = Math.floor(
            ((this.newTask.estimatedtime - this.minutes) / 60) % 8
        );
        this.days = Math.floor(
            (this.newTask.estimatedtime - this.hours - this.minutes) / 480
        );
    }

    ngOnInit() {
        this.newDate = new Date(this.data.task?.startdate);
    }

    isUserAssigned(userProject: UserProject): boolean {
        if (
            this.taskassignmentList?.find(
                (taskAssignment) =>
                    taskAssignment.userproject.id == userProject.id
            )
        )
            return true;
        return false;
    }

    compareById(option: any, compareTo: any): boolean {
        if (option && compareTo) return option.id === compareTo.id;
        return false;
    }

    compareSprint(sprintOption: Project, sprint: Project): boolean {
        if (!sprint && sprintOption == new Project()) {
            return true;
        }
        return sprint?.id === sprintOption?.id;
    }

    updateDate(event: any) {
        this.newDate = new Date(event);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addUser(userProject: UserProject): void {
        const newAssignement = new TaskAssignment(userProject, this.data.task);
        this.taskassignmentList.push(newAssignement);
    }

    addOrEditTask(): void {
        this.newTask.startdate = new Date(this.newDate).toISOString();
        this.newTask.estimatedtime =
            this.days * 480 + this.hours * 60 + this.minutes;
        if (this.data.edition) {
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
            console.log(this.newTask.startdate);
            this.taskService
                .edit(this.data.task.id!, this.newTask)
                .subscribe(observer);
        } else {
            const observer = {
                next: (task: Task) => {
                    this.newTask.id = task.id;
                    const taskAdmin = new TaskAssignment(
                        this.userProjectList.find(
                            (userProject) =>
                                userProject.user.id == this.data.user.id
                        )!,
                        task
                    );
                    taskAdmin.isTaskCreator = true;
                    this.taskAssignmentService.create(taskAdmin).subscribe();
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
                    this.dialogRef.close({
                        task: this.newTask
                    });
                    this.data.subject.next({
                        method: 'add',
                        task: this.newTask
                    });
                }
            };
            if (!this.newTask.sprint?.id) {
                this.newTask.sprint = null;
            }
            this.taskService.create(this.newTask).subscribe(observer);
        }
    }
}
