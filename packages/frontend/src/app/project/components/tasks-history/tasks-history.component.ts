import { Component, Input, OnInit } from '@angular/core';
import { KanbanList } from 'src/app/models/kanbanlist.model';
import { Task } from 'src/app/models/task.model';
import { TaskAssignment } from 'src/app/models/taskassignment.model';
import { TimeEntry } from 'src/app/models/timeentry.model';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';
import { TimeentryService } from 'src/app/services/timeentry.service';

export interface tacheAssignment {
    task: Task;
    taskassignments:
        | {
              taskAssignment: TaskAssignment;
              timeentries: TimeEntry[];
          }[]
        | undefined;

    visible: boolean;
    totalWorkedTime: number;
}

@Component({
    selector: 'app-tasks-history',
    templateUrl: './tasks-history.component.html',
    styleUrls: ['./tasks-history.component.css']
})
export class TasksHistoryComponent implements OnInit {
    isTaskReduced: boolean = true;
    tasksLists: tacheAssignment[] = [];
    projectTasks = [];

    @Input() kanbanList!: KanbanList[];

    //taskassignmentList: TaskAssignment[] = [];

    constructor(
        private taskassignmentService: TaskassignmentService,
        private timeEntriesService: TimeentryService
    ) {}

    ngOnInit(): void {
        // affichage des tâches en cours:
        //console.log(this.kanbanList);
        this.kanbanList.forEach((knbn) => {
            knbn.taskList.map((task) => {
                this.tasksLists.push({
                    task: task.task,
                    taskassignments: task.taskAssignments,
                    visible: false,
                    totalWorkedTime: 0
                });
            });
        });

        this.tasksLists.sort(function (task1: any, task2: any) {
            return (
                new Date(task2.task.startdate).getTime() -
                new Date(task1.task.startdate).getTime()
            );
        });

        this.tasksLists.map((task) => {
            task.taskassignments?.map((taskAssignment) => {
                taskAssignment.timeentries.map((timeEntry) => {
                    task.totalWorkedTime += timeEntry.workedtime;
                });
            });
        });
    }
}
