import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Kanbanstatus } from '../models/kanbanstatus.model';
import { KanbanstatusService } from '../services/kanbanstatus.service';

@Component({
    selector: 'app-kanban-status',
    templateUrl: './kanban-status.component.html',
    styleUrls: ['./kanban-status.component.css']
})
export class KanbanStatusComponent implements OnInit {

    @Input() kanbanstatus!:Kanbanstatus;

    @Output() kanbanDeleted: EventEmitter<any> = new EventEmitter();

    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    newColor!: string;

    constructor(
        private kanbanstatusService: KanbanstatusService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.newColor = this.kanbanstatus.color;
    }

    editKanbanStatus() {
        this.isEditColumn = !this.isEditColumn;
    }

    validateEditKanbanStatus(){
        this.kanbanstatus.color = this.newColor;

        const kanbanObserver = {
            error : (err: any) => {
                console.log(`Erreur edition kanbanstatus : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during kanban edition<br><br>${err.error.driverError.detail}`);
            },
            complete : () => {
                this.toastService.success(" Column edited !");
            }
        }
        this.kanbanstatusService.edit(this.kanbanstatus).subscribe(kanbanObserver);

        this.editKanbanStatus();
    }

    deleteKanbanStatus(){
        const kanbanObserver = {
            next: (result: any) => {
                console.log(`${result}`);
                this.toastService.success(`Column deleted ! ${result}`);
            },
            error : (err: any) => {
                console.log(`Erreur suprresion kanbanstatus : ${err.error['driverError'].detail}`);
                this.toastService.error(`Error during kanban supression<br><br>${err.error.driverError.detail}`);
            },
            complete : () => {
                this.kanbanDeleted.emit(this.kanbanstatus);
            }
        }
        this.kanbanstatusService.delete(this.kanbanstatus.id!).subscribe(kanbanObserver);
    }
}
