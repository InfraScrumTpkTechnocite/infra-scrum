import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Task } from '../models/task.model';
import { TaskAssignment } from '../models/taskassignment.model';
import { MatDialog } from '@angular/material/dialog';
import { EditNewTasksComponent } from '../form/edit-new-tasks/edit-new-tasks.component';
import { TaskType } from '../models/tasktype.model';
import { Project } from '../models/project.model';
import { UserProject } from '../models/userproject.model';
import { User } from '../models/user.model';
import { KanbanList } from '../models/kanbanlist.model';
import { TaskService } from '../services/task.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TimeEntryComponent } from '../form/time-entry/time-entry.component';

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
    taskassignmentList: any;

    showTask: boolean = true;
    @Input() projectid!: string | undefined | null;
    @Input() project!: Project;

    @Input() showCurrentUserTasks!: boolean;
    @Input() user!: User;

    // @Output() taskDeleted: EventEmitter<any> = new EventEmitter();
    @Output() editTaskOutput: EventEmitter<any> = new EventEmitter();

    constructor(
        private taskService: TaskService,
        public dialog: MatDialog,
        public toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.taskassignmentList = this.kanbanList
            .find((kanban) => kanban.kanban.id == this.task.kanbanstatus.id)
            ?.taskList.find((task) => task.task.id == this.task.id)
            ?.taskAssignments
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
        this.editTaskOutput.emit(this.task)
    }

    deleteTask() {
        this.taskService.delete(this.task.id!).subscribe({
            next: () => {},
            error: (err) => {
                let errorMessage = '';
                switch (err.error.driverError.code) {
                    case '23503': //foreign key constraint violation
                        errorMessage = `Task can't be deleted : time entries still exist for that task`;
                        break;
                    default:
                        errorMessage = `Error during task deletion<br><br>${err.error.driverError.detail}`;
                }
                this.toastService.error(errorMessage);
            },
            complete: () => {
                this.kanbanList[this.task.kanbanstatus.order].taskList.splice(
                    this.kanbanList[
                        this.task.kanbanstatus.order
                    ].taskList.findIndex(
                        (tasks) => tasks.task.id == this.task.id
                    ),
                    1
                );
                this.subject.next({
                    method: 'delete',
                    task: this.task,
                    projectid: this.projectid
                });
                this.toastService.success('Task deleted !');
            }
        });
    }

    ngOnChanges() {
        // console.log(
        //     `ngOnChanges - showCurrentUserTasks: ${this.showCurrentUserTasks}`
        // );
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
                this.taskassignmentList.find((taskAssignments: any) => {
                    return (
                        taskAssignments.taskAssignment.userproject.user.id == this.user.id &&
                        taskAssignments.taskAssignment.task.id == this.task.id
                    );
                })
            )
                this.showTask = this.showTask && true;
            else this.showTask = false;
    }

    openTimeEntriesDialog(){
        this.dialog.open(TimeEntryComponent, {
            data: {
                task:this.task,
                user: this.user,
                kanbanlist : this.kanbanList
            }
        });
    }
}
