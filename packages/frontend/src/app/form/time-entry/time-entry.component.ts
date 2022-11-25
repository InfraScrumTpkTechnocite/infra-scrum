import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { KanbanList } from 'src/app/models/kanbanlist.model';
import { Task } from 'src/app/models/task.model';
import { TaskAssignment } from 'src/app/models/taskassignment.model';
import { TimeEntry } from 'src/app/models/timeentry.model';
import { User } from 'src/app/models/user.model';
import { TimeentryService } from 'src/app/services/timeentry.service';

export interface TimeEntryDate {
    timeEntry: TimeEntry;
    hours: number;
    minutes: number;
}

@Component({
    selector: 'app-time-entry',
    templateUrl: './time-entry.component.html',
    styleUrls: ['./time-entry.component.css']
})
export class TimeEntryComponent implements OnInit {
    timeEntries: TimeEntryDate[] = [];
    taskAssignment: TaskAssignment;

    constructor(
        private timeentryService: TimeentryService,
        private toastService : HotToastService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            user: User;
            task: Task;
            kanbanlist: KanbanList[];
        }
    ) {this.taskAssignment = data.kanbanlist.find((knb) => knb.kanban.id == this.data.task.kanbanstatus.id)!
        .taskList.find((tsk) => tsk.task.id == this.data.task.id)!
        .taskAssignments!.find(
            (assign) =>
                assign.taskAssignment.userproject.user.id ==
                this.data.user.id
        )!.taskAssignment}

    ngOnInit(): void {
        this.timeEntries = this.data.kanbanlist
            .find((knb) => knb.kanban.id == this.data.task.kanbanstatus.id)!
            .taskList.find((tsk) => tsk.task.id == this.data.task.id)!
            .taskAssignments!.find(
                (assign) =>
                    assign.taskAssignment.userproject.user.id ==
                    this.data.user.id
            )!
            .timeentries.map((timeentry) => ({
                timeEntry: timeentry,
                hours: Math.floor(
                    (timeentry.workedtime - (timeentry.workedtime % 60)) / 60
                ),
                minutes: timeentry.workedtime % 60
            }));
    }

    updateDate(event: any) {
        return new Date(event).toDateString();
    }

    addEntry() {
        this.timeEntries.push({timeEntry: new TimeEntry(this.taskAssignment), hours: 0, minutes: 0} as TimeEntryDate);
    }

    confirmAddEntry(timeentrydate: TimeEntryDate) {
        var timeentry: TimeEntry = timeentrydate.timeEntry;
        timeentry.workedtime = timeentrydate.hours * 60 + timeentrydate.minutes;
        timeentry.dayofwork = new Date(timeentrydate.timeEntry.dayofwork).toISOString(); 
        this.timeentryService
            .create(timeentry)
            .subscribe({ next: (timeentry:TimeEntry) => {
                this.data.kanbanlist
                .find((knb) => knb.kanban.id == this.data.task.kanbanstatus.id)!
                .taskList.find((tsk) => tsk.task.id == this.data.task.id)!
                .taskAssignments!.find(
                    (assign) =>
                        assign.taskAssignment.userproject.user.id ==
                        this.data.user.id
                )!.timeentries.push(timeentry);
            },
            error: (err:any) => {
                this.toastService.error(
                    `Error during timeentry creation<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success(
                    `TimeEntry created`
                )
            }
        });
    }

    editEntry(timeentrydate : TimeEntryDate){
        var timeentry: TimeEntry = timeentrydate.timeEntry;
        timeentry.workedtime = timeentrydate.hours * 60 + timeentrydate.minutes;
        timeentry.dayofwork = new Date(timeentrydate.timeEntry.dayofwork).toISOString(); 
        this.timeentryService
            .update(timeentry)
            .subscribe({ next: (timeentry:TimeEntry) => {
                this.data.kanbanlist
                .find((knb) => knb.kanban.id == this.data.task.kanbanstatus.id)!
                .taskList.find((tsk) => tsk.task.id == this.data.task.id)!
                .taskAssignments!.find(
                    (assign) =>
                        assign.taskAssignment.userproject.user.id ==
                        this.data.user.id
                )!.timeentries.push(timeentry);
            },
            error: (err:any) => {
                this.toastService.error(
                    `Error during timeentry edition<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                this.toastService.success(
                    `TimeEntry updated`
                )
            }
        });
    }
}
