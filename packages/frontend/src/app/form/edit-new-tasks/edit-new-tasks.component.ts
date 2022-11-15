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
    newTaskAssignmentList: TaskAssignment[] = [];
    userProjectList: UserProject[] = [];
    myUserProject!: UserProject;

    noType: TaskType = new TaskType();

    noSprint: Project = new Project();

    noKanban: Kanbanstatus = new Kanbanstatus();

    newDate: Date = new Date();

    days: number;
    hours: number;
    minutes: number;

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
        this.data.userProjectList.map((userProject) =>
            this.userProjectList.push(userProject)
        );
        this.newDate = new Date(this.data.task?.startdate);
        const index = this.userProjectList.findIndex(
            (userProject) => userProject.user!.id == this.data.user!.id
        );
        if (!this.data.edition && index >= 0) {
            /** Remove yourself from the user you can assign */
            this.myUserProject = this.userProjectList[index];
            this.userProjectList.splice(index, 1);
        }
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
        this.newTaskAssignmentList.push(newAssignement);
        this.userProjectList.splice(this.userProjectList.findIndex((userProjectFromList) => userProjectFromList.id == userProject.user.id),1)
    }

    addOrEditTask(): void {
        this.newTask.startdate = new Date(this.newDate).toISOString();
        this.newTask.estimatedtime =
            this.days * 480 + this.hours * 60 + this.minutes;
        if (this.data.edition) {
            //** Task EDITION */
            const observer = {
                next: () => {
                    this.newTaskAssignmentList.map((taskAssignment) =>{
                        this.taskAssignmentService
                            .create(taskAssignment)
                            .subscribe((taskAssignment: TaskAssignment) =>
                                this.taskassignmentList.push(taskAssignment)
                            )}
                    );
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
            this.taskService
                .edit(this.data.task.id!, this.newTask)
                .subscribe(observer);
        } else {
            //** Task CREATION */
            const observer = {
                next: (task: Task) => {
                    this.newTask.id = task.id;
                    /** Add you as the creator of the task */
                    const taskAdmin = new TaskAssignment(
                        this.myUserProject,
                        task
                    );
                    taskAdmin.isTaskCreator = true;
                    this.newTaskAssignmentList.push(taskAdmin);
                    this.newTaskAssignmentList.map((taskAssignment) =>
                        this.taskAssignmentService
                            .create(taskAssignment)
                            .subscribe((taskAssignment: TaskAssignment) =>
                                this.taskassignmentList.push(taskAssignment)
                            )
                    );
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
