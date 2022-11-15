import { Kanbanstatus } from './kanbanstatus.model';
import { Task } from './task.model';

export class KanbanList {
    kanban!: Kanbanstatus;
    tasks!: Task[];

    constructor() {}
}
