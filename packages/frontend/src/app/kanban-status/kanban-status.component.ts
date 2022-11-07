import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Kanbanstatus } from '../models/kanbanstatus.model';
import { KanbanstatusService } from '../services/kanbanstatus.service';
import { TaskType } from '../models/tasktype.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { UserProject } from '../models/userproject.model';

interface KanbanList {
    kanban: Kanbanstatus;
    tasks: Task[];
}
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

    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    newColor!: string;
    kanbanstatus!: KanbanList;

    constructor(
        private kanbanstatusService: KanbanstatusService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.kanbanstatus = this.kanbanList as KanbanList;
        this.newColor = this.kanbanstatus.kanban.color;
    }

    editKanbanStatus() {
        this.isEditColumn = !this.isEditColumn;
    }

    validateEditKanbanStatus() {
        this.kanbanstatus.kanban.color = this.newColor;

        const kanbanObserver = {
            next: (response: any) => {
                console.log(`${response}`);
                this.toastService.success(' Column edited !');
                this.subject.next({
                    method: 'edit',
                    kanban: this.kanbanstatus
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
                this.toastService.success(`Column deleted ! ${result}`);
                //this.subject.next({method: "delete", kabanstatus: this.kanbanstatus});
            },
            error: (err: any) => {
                console.log(
                    `Erreur suprresion kanbanstatus : ${err.error['driverError'].detail}`
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
}
