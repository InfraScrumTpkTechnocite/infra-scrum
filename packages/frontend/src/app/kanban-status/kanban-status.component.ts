import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { WebSocketSubject } from 'rxjs/webSocket';
import { KanbanstatusService } from '../services/kanbanstatus.service';
import { TaskType } from '../models/tasktype.model';
import { Project } from '../models/project.model';
import { UserProject } from '../models/userproject.model';
import { User } from '../models/user.model';
import { KanbanList } from '../models/kanbanlist.model';

@Component({
    selector: 'app-kanban-status',
    templateUrl: './kanban-status.component.html',
    styleUrls: ['./kanban-status.component.css']
})
export class KanbanStatusComponent implements OnInit {
    @Input() kanbanList!: any;

    @Input() subject!: WebSocketSubject<any>;

    @Input() taskTypeList!: TaskType[];

    @Input() userProjectList!: UserProject[];

    @Input() sprintList!: Project[];

    @Output() kanbanDeleted: EventEmitter<any> = new EventEmitter();

    @Output() addTaskFromKanban: EventEmitter<any> = new EventEmitter();

    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    newName!: string;
    newColor!: string;
    kanbanstatus!: KanbanList;

    @Input() projectid!: string | undefined | null;
    @Input() project!: Project;

    @Input() user!: User;
    @Input() isUserProjectadmin!: boolean;

    constructor(
        private kanbanstatusService: KanbanstatusService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        //console.log(this.user);
        //console.log(this.isUserProjectadmin);
        this.kanbanstatus = this.kanbanList as KanbanList;
        this.newName = this.kanbanstatus.kanban.name;
        this.newColor = this.kanbanstatus.kanban.color;
        //console.log(`ngOnInit - this.project ${JSON.stringify(this.project)}`);
    }

    editKanbanStatus() {
        this.isEditColumn = !this.isEditColumn;
    }

    validateEditKanbanStatus() {
        this.kanbanstatus.kanban.name = this.newName;
        this.kanbanstatus.kanban.color = this.newColor;

        const kanbanObserver = {
            next: (response: any) => {
                console.log(`${response}`);
                this.toastService.success('Column edited !');
                this.subject.next({
                    method: 'edit',
                    kanban: this.kanbanstatus.kanban,
                    tasks: this.kanbanstatus.tasks,
                    projectid: this.projectid
                });
            },
            error: (err: any) => {
                console.log(
                    `Erreur edition kanbanstatus : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during kanban edition<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {}
        };
        this.kanbanstatusService
            .edit(this.kanbanstatus.kanban)
            .subscribe(kanbanObserver);

        this.editKanbanStatus();
    }

    deleteKanbanStatus() {
        const kanbanObserver = {
            next: (result: any) => {
                console.log(`${result}`);
                this.toastService.success(`Column deleted !`);
                this.subject.next({
                    method: 'delete',
                    kaban: this.kanbanstatus.kanban,
                    projectid: this.projectid
                });
            },
            error: (err: any) => {
                console.log(
                    `Erreur supression kanbanstatus : ${err.error['driverError'].detail}`
                );
                this.toastService.error(
                    `Error during kanban supression<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.kanbanDeleted.emit(this.kanbanstatus);
            }
        };
        this.kanbanstatusService
            .delete(this.kanbanstatus.kanban.id!)
            .subscribe(kanbanObserver);
    }
    addTask() {
        this.addTaskFromKanban.emit(this.kanbanstatus);
    }
}
