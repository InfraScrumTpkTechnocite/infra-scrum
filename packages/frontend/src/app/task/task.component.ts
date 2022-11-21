import { Component, Input, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Task } from '../models/task.model';
import { TaskAssignment } from '../models/taskassignment.model';
import { TaskassignmentService } from '../services/taskassignment.service';
import { MatDialog } from '@angular/material/dialog';
import { EditNewTasksComponent } from '../form/edit-new-tasks/edit-new-tasks.component';
import { TaskType } from '../models/tasktype.model';
import { Project } from '../models/project.model';
import { UserProject } from '../models/userproject.model';
import { User } from '../models/user.model';
import { KanbanList } from '../models/kanbanlist.model';

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
    @Input() userProjectList!: UserProject[];
    @Input() kanbanList!: KanbanList[];
    taskassignmentList!: TaskAssignment[];

    showTask: boolean = true;
    @Input() projectid!: string | undefined | null;
    @Input() project!: Project;

    @Input() showCurrentUserTasks!: boolean;
    @Input() user!: User;

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

        // console.log(
        //     `showTask : ${this.showTask} - projectid : ${
        //         this.projectid
        //     } - task sprint id : ${
        //         this.task.sprint?.id
        //     } - sprint : ${JSON.stringify(
        //         this.task.sprint
        //     )} - project.id ${JSON.stringify(this.project)}`
        // );
    }

    toggleTaskOverview() {
        this.isTaskOverview = !this.isTaskOverview;
    }

    editTask() {
        const task = this.task;
        console.log(this.userProjectList);
        const dialogRef = this.dialog.open(EditNewTasksComponent, {
            data: {
                task: task,
                taskassignmentList: this.taskassignmentList,
                userProjectList: this.userProjectList,
                taskTypeList: this.taskTypeList,
                sprintList: this.sprintList,
                edition: true,
                kanbanList: this.kanbanList,
                user: this.user,
                subject: this.subject
            }
        });
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data) {
                this.task = data.task as Task;
                this.kanbanList[this.task.kanbanstatus.order].tasks[
                    this.kanbanList[
                        this.task.kanbanstatus.order
                    ].tasks.findIndex((task) => task.id == this.task.id)
                ] = this.task;

                //this.task.id = data.taskid;
            }
        });
    }

    ngOnChanges() {
        console.log(
            `ngOnChanges - showCurrentUserTasks: ${this.showCurrentUserTasks}`
        );

        if (this.task.sprint?.id)
            //sprint de la tâche existe => vue globale ou sprint
            this.showTask =
                this.projectid == this.project.id ||
                this.task.sprint.id == this.projectid;
        else {
            //sinon vue globale seulement
            this.showTask = this.projectid == this.project.id;
        }

        if (this.showCurrentUserTasks)
            if (
                this.taskassignmentList.find((taskAssignment) => {
                    return (
                        taskAssignment.userproject.user.id == this.user.id &&
                        taskAssignment.task.id == this.task.id
                    );
                })
            )
                this.showTask = this.showTask && true;
            else this.showTask = false;
    }
}
