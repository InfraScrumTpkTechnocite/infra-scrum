import { Component, Input, OnInit } from '@angular/core';
import { KanbanList } from 'src/app/models/kanbanlist.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
export interface IGanttChartEvent {
    startDate: Date;
    endDate: Date;
    name: string;
}

export interface IGanttChartRow {
    id: string;
    name: string;
    events: IGanttChartEvent[];
}

export interface XAxis {
    name: string;
    durationPercentage: number;
}
@Component({
    selector: 'app-chart-gantt',
    templateUrl: './chart-gantt.component.html',
    styleUrls: ['./chart-gantt.component.css']
})
export class ChartGanttComponent implements OnInit {
    @Input() sprints!: Project[];

    @Input() kanbanList!: KanbanList[];

    isHidden!: boolean[][];
    isProject: boolean = true;
    rows: IGanttChartRow[] = [];
    startDate!: Date;
    endDate!: Date;
    chartPeriodDays!: number;
    monthAxis!: XAxis[];
    weekAxis!: XAxis[];
    dayAxis!: XAxis[];

    constructor() {}

    ngOnInit(): void {
        this.sprints.map((sprint) =>
            this.rows.push({
                id: sprint.id,
                name: sprint.name,
                events: [
                    {
                        name: sprint.name,
                        startDate: new Date(sprint.startdate),
                        endDate: new Date(sprint.enddate!)
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow)
        );
        this.setXAxis();
        this.isHidden = new Array<Array<boolean>>(this.rows.length);
        this.isHidden.fill([], 0, this.isHidden.length);
        this.isHidden.forEach((row, index) => {
            this.isHidden[index] = new Array(this.rows[index].events.length);
            this.isHidden[index].fill(true, 0, this.isHidden.length);
        });
    }

    /** Return the difference in months */
    monthDiff(dateFrom: Date, dateTo: Date): number {
        dateFrom = new Date(dateFrom);
        dateTo = new Date(dateTo);
        return (
            dateTo.getMonth() -
            dateFrom.getMonth() +
            12 * (dateTo.getFullYear() - dateFrom.getFullYear())
        );
    }

    /** Given a start and end date return the difference in days */
    dateDifference(endDate: Date, startDate: Date): number {
        endDate = new Date(endDate);
        startDate = new Date(startDate);

        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        const utc1 = Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );
        const utc2 = Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );

        return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY)) + 1;
    }

    /** Month name based on number */
    getMonthName(date: Date): string {
        // TODO : change default to current language //
        return date.toLocaleString(['default'], { month: 'long' });
    }

    /** Week name based on number */
    getWeekName(date: Date): string {
        // TODO : change default to current language //
        return date.toLocaleString(['default'], {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /** Day name based on number */
    getDayName(date: Date): string {
        // TODO : change default to current language //
        return date
            .toLocaleString(['default'], { weekday: 'long' })
            .toUpperCase()[0];
    }

    /** Return the number of days in the specified month */
    daysInMonth(date: Date): number {
        date = new Date(date);
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    /** Add the entirety of first month*/
    addMonths(date: Date, monthsToAdd: number): Date {
        date = new Date(date);
        // always assume just shifting one month across so set date to first day of month
        const firstDayOfMonth = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );
        return new Date(
            firstDayOfMonth.setMonth(monthsToAdd + firstDayOfMonth.getMonth())
        );
    }

    /** Add the entirety of first month*/
    addEndMonth(date: Date): Date {
        date = new Date(date);
        // always assume just shifting one month across so set date to last day of month
        const lastDayOfLastMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        );
        return new Date(
            lastDayOfLastMonth.setMonth(lastDayOfLastMonth.getMonth())
        );
    }

    getMonths(startDate: Date, endDate: Date): XAxis[] {
        const startMonth = startDate.getMonth();
        const endMonth = endDate.getMonth();
        const adjustedEndDate = this.addEndMonth(endDate);
        const totalDurationDays = this.dateDifference(
            startDate,
            adjustedEndDate
        );
        let months: XAxis[] = new Array();
        for (var i = 0; i <= endMonth - startMonth; i++) {
            const adjustedStartDate = this.addMonths(startDate, i);
            const daysInMonth = this.daysInMonth(adjustedStartDate);
            months.push({
                name: this.getMonthName(adjustedStartDate),
                durationPercentage: (daysInMonth / totalDurationDays) * 100
            });
        }
        return months;
    }

    getWeeks(startDate: Date, endDate: Date): XAxis[] {
        let weekAxis: XAxis[] = [];
        startDate.setDate(1);
        endDate = this.addEndMonth(endDate);
        let firstDayOfMonth = startDate.getDay();
        firstDayOfMonth =
            firstDayOfMonth == 1 || firstDayOfMonth == 8
                ? firstDayOfMonth
                : 8 - firstDayOfMonth;
        weekAxis.push({
            name: '',
            durationPercentage:
                (1 / this.dateDifference(startDate, endDate)) *
                100 *
                firstDayOfMonth
        });
        var daysRemaining: number =
            this.dateDifference(startDate, endDate) - firstDayOfMonth;
        var tempDate = new Date(startDate);
        tempDate.setDate(tempDate.getDate() + firstDayOfMonth);
        for (
            let i = new Date(tempDate);
            i <= endDate;
            i.setDate(i.getDate() + 7)
        ) {
            weekAxis.push({
                name: this.getWeekName(i),
                durationPercentage:
                    (1 / this.dateDifference(startDate, endDate)) *
                    (daysRemaining > 7 ? 7 : daysRemaining) *
                    100
            });

            daysRemaining -= 7;
        }
        return weekAxis;
    }

    getDays(startDate: Date, endDate: Date): XAxis[] {
        let daysAxis: XAxis[] = [];
        startDate.setDate(1);
        endDate = this.addEndMonth(endDate);
        for (
            let i = new Date(startDate);
            i <= endDate;
            i.setMonth(i.getMonth() + 1)
        ) {
            for (
                let j = new Date(i);
                j.getMonth() == i.getMonth();
                j.setDate(j.getDate() + 1)
            ) {
                daysAxis.push({
                    name: this.getDayName(j),
                    durationPercentage:
                        (1 / this.dateDifference(startDate, endDate)) * 100
                });
            }
        }
        return daysAxis;
    }

    /** Return the percentage of days over the total period */
    getEventDurationPercentage(event: IGanttChartEvent): number {
        const eventDays = this.dateDifference(event.endDate, event.startDate);
        return (eventDays / this.chartPeriodDays) * 100;
    }

    /** Return the percentage of days over the total period */
    getEventOffsetPercentage(eventStartDate: Date): number {
        const daysPriorToEventStart = this.dateDifference(
            eventStartDate,
            this.startDate
        );
        return ((daysPriorToEventStart - 1) / this.chartPeriodDays) * 100;
    }

    /** Get number of event overlaping each other at the dates of the event */
    getEventNumberOfOverlap(event: IGanttChartEvent): number {
        var eventIndex: number;
        var row: IGanttChartRow;

        var row = this.rows.find((row) => {
            eventIndex = row.events.findIndex(
                (eventFromRows) => eventFromRows == event
            );
            return row.events.find((eventFromRows) => eventFromRows == event);
        })!;
        return row.events.filter(
            (eventFromRow, index) =>
                eventFromRow.startDate < event.endDate &&
                eventFromRow.endDate > event.startDate &&
                index < eventIndex
        ).length;
    }

    /** Get number of events overlaping each other in the row */
    getEventNumberOfOverlapInRow(row: IGanttChartRow): number {
        var maxOverlap: number[] = [];
        var period = { startDate: new Date(), endDate: new Date() };
        row.events.map((event, index) => {
            maxOverlap[index] = 0;
            period = { startDate: event.startDate, endDate: event.endDate };
            row.events.map((event) => {
                if (
                    period.startDate < event.endDate &&
                    period.endDate > event.startDate
                )
                    maxOverlap[index]++;
            });
        });
        return Math.max(...maxOverlap);
    }

    /** Set rows to be tasks of sprint */
    changeSprintDisplay(sprint: IGanttChartRow) {
        var tasks: Task[] = [];
        this.kanbanList.map((kanbanAndTasks) => {
            kanbanAndTasks.taskList.map((task) => {
                task.task.sprint != null && task.task.sprint!.id == sprint.id
                    ? tasks.push(task.task)
                    : '';
            });
        });
        this.rows = [];
        tasks.map((task) =>
            this.rows.push({
                id: task.id,
                name: task.name,
                events: [
                    {
                        name: task.name,
                        startDate: new Date(task.startdate),
                        endDate: this.estimatedTimeToDate(
                            task.startdate,
                            task.estimatedtime
                        )
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow)
        );
        this.rows.sort(
            (a, b) =>
                Math.min(...a.events.map((event) => Number(event.startDate))) -
                Math.min(...b.events.map((event) => Number(event.startDate)))
        );
        this.setXAxis();
        this.isProject = false;
    }

    /** Set rows to be sprints of project */
    changeProjectDisplay() {
        this.rows = [];
        this.sprints.map((sprint) =>
            this.rows.push({
                id: sprint.id,
                name: sprint.name,
                events: [
                    {
                        name: sprint.name,
                        startDate: new Date(sprint.startdate),
                        endDate: new Date(sprint.enddate!)
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow)
        );
        this.setXAxis();
        this.isProject = true;
    }

    estimatedTimeToDate(startdate: string, estimatedtime: number): Date {
        var StartDate = new Date(startdate);
        var estimatedDate = new Date(StartDate);
        estimatedDate.setTime(
            estimatedDate.getTime() +
                ((estimatedtime / 60) % 8) * 60 * 60 * 1000
        ); //** hours */
        estimatedDate.setTime(
            estimatedDate.getTime() +
                (estimatedtime / 480) * 3 * 24 * 60 * 60 * 1000
        ); //** days */
        estimatedDate.setTime(
            estimatedDate.getTime() + (estimatedtime % 60) * 60 * 1000
        ); //** minutes */
        return estimatedDate;
    }

    setXAxis() {
        this.startDate = this.addMonths(
            new Date(
                Math.min(
                    ...this.rows.map((row) =>
                        Math.min(
                            ...row.events.map((event) =>
                                Number(event.startDate)
                            )
                        )
                    )
                )
            ),
            0
        );
        this.endDate = new Date(
            Math.max(
                ...this.rows.map((row) =>
                    Math.max(
                        ...row.events.map((event) => Number(event.endDate))
                    )
                )
            )
        );
        this.chartPeriodDays = this.dateDifference(
            this.addEndMonth(this.endDate),
            this.startDate
        );
        this.monthAxis = this.getMonths(this.startDate, this.endDate);
        this.weekAxis = this.getWeeks(this.startDate, this.endDate);
        this.dayAxis = this.getDays(this.startDate, this.endDate);
    }
}
