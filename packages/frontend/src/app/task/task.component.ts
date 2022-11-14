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
    taskassignmentList!: TaskAssignment[];

    showTask: boolean = true;
    @Input() projectid!: string | undefined | null;
    @Input() project!: Project;

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

        if (this.task.sprint?.id)
            //sprint de la tâche existe => vue globale ou sprint
            this.showTask =
                this.projectid == this.project.id ||
                this.task.sprint.id == this.projectid;
        else {
            //sinon vue globale seulement
            this.showTask = this.projectid == this.project.id;
        }

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
        const dialogRef = this.dialog.open(EditNewTasksComponent, {
            data: {
                task: task,
                taskassignmentList: this.taskassignmentList,
                userProjectList: this.userProjectList,
                taskTypeList: this.taskTypeList,
                sprintList: this.sprintList,
                edition: true,
                subject: this.subject
            }
        });
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data) {
                this.task = data.task as Task;
                this.task.id = data.taskid;
            }
        });
    }
}
