import { Kanbanstatus } from './kanbanstatus.model';
import { Task } from './task.model';
import { TaskAssignment } from './taskassignment.model';
import { TimeEntry } from './timeentry.model';

export class KanbanList {
    kanban!: Kanbanstatus;
    taskList!: {
        task: Task;
        taskAssignments: {
            taskAssignment: TaskAssignment;
            timeentries: TimeEntry[];
        }[] | undefined;
    }[];
    constructor() {}
}
