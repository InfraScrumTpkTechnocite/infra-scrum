import { Component, Input, OnInit } from '@angular/core';
import { KanbanList } from 'src/app/models/kanbanlist.model';
import { Task } from 'src/app/models/task.model';
import { TaskAssignment } from 'src/app/models/taskassignment.model';
import { TaskassignmentService } from 'src/app/services/taskassignment.service';

export interface tacheAssignment {
    task: Task;
    taskassignments: TaskAssignment[];
    visible: boolean;
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

    taskassignmentList: TaskAssignment[] = [];

    constructor(private taskassignmentService: TaskassignmentService) {}

    ngOnInit(): void {
        // affichage des tâches en cours:

        this.kanbanList.forEach((knbn) => {
            knbn.tasks.map((task) => {
                this.tasksLists.push({
                    task: task,
                    taskassignments: [],
                    visible: false
                });
            });
        });
        this.tasksLists.sort(function (task1: any, task2: any) {
            return (
                new Date(task2.task.startdate).getTime() -
                new Date(task1.task.startdate).getTime()
            );
        });

        // affichage users assignés à la tache:

        this.tasksLists.map((task: tacheAssignment) =>
            this.taskassignmentService
                .findAllUsersOfTask(task.task.id!)
                .subscribe({
                    next: (taskassignments: TaskAssignment[]) => {
                        task.taskassignments = taskassignments;
                    },
                    error: () => {},
                    complete: () => {}
                })
        );
    }
}
