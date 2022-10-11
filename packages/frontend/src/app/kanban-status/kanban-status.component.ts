import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'kanban-status',
    templateUrl: './kanban-status.component.html',
    styleUrls: ['./kanban-status.component.css']
})
export class KanbanStatusComponent implements OnInit {
    isSprintsOpen: boolean = false;
    isEditColumn: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    editKanbanStatus() {
        this.isEditColumn = !this.isEditColumn;
    }
}
