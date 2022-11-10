import { Component } from '@angular/core';
export interface IGanttChartEvent {
    startDate: Date;
    endDate: Date;
    name: string;
}

export interface MonthAxis {
    monthName: string;
    monthDurationPercentage: number;
}

export interface IGanttChartMileStone {
    name: string;
    date: Date;
}

// The Gantt chart component will take in a collection of this object model
export interface IGanttChartRow {
    name: string;
    events: IGanttChartEvent[];
    mileStones: IGanttChartMileStone[];
}

@Component({
    selector: 'app-chart-gantt',
    templateUrl: './chart-gantt.component.html',
    styleUrls: ['./chart-gantt.component.css']
})
export class ChartGanttComponent {
    isHidden: boolean[][];
    rows!: IGanttChartRow[];
    startDate: Date;
    endDate: Date;
    chartPeriodDays!: number;
    monthAxis: MonthAxis[];

    constructor() {
        this.rows = [
            {
                name: 'Sprint 1',
                events: [
                    {
                        name: 'Task 1',
                        startDate: new Date('2021-01-01'),
                        endDate: new Date('2021-01-31')
                    } as IGanttChartEvent,
                    // {
                    //     name: 'Task 1.5',
                    //     startDate: new Date('2021-01-03'),
                    //     endDate: new Date('2021-01-10')
                    // } as IGanttChartEvent,
                    {
                        name: 'Task 2',
                        startDate: new Date('2021-02-03'),
                        endDate: new Date('2021-02-17')
                    } as IGanttChartEvent,
                    {
                        name: 'Task 3',
                        startDate: new Date('2021-03-01'),
                        endDate: new Date('2021-03-31')
                    } as IGanttChartEvent,
                    {
                        name: 'Task 4',
                        startDate: new Date('2021-04-05'),
                        endDate: new Date('2021-04-19')
                    } as IGanttChartEvent
                ],
                mileStones: [
                    {
                        name: 'Feature complete',
                        date: new Date('2021-04-15')
                    } as IGanttChartMileStone
                ]
            } as IGanttChartRow,
            {
                name: 'Sprint 2',
                events: [
                    {
                        name: 'Market activity',
                        startDate: new Date('2021-02-15'),
                        endDate: new Date('2021-02-28')
                    } as IGanttChartEvent
                ],
                mileStones: [
                    {
                        name: 'Funding round complete',
                        date: new Date('2021-01-28')
                    } as IGanttChartMileStone
                ]
            } as IGanttChartRow,
            {
                name: 'Sprint 3',
                events: [
                    {
                        name: 'Busy period',
                        startDate: new Date('2021-03-02'),
                        endDate: new Date('2021-03-15')
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow,
            {
                name: 'Sprint 4',
                events: [
                    {
                        name: 'Manual collection',
                        startDate: new Date('2021-03-15'),
                        endDate: new Date('2021-03-30')
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow,
            {
                name: 'Sprint 5',
                events: [
                    {
                        name: 'Busy period',
                        startDate: new Date('2021-09-15'),
                        endDate: new Date('2021-09-30')
                    } as IGanttChartEvent
                ]
            } as IGanttChartRow
        ];
        this.startDate = new Date(
            Math.min(
                ...this.rows.map((row) =>
                    Math.min(
                        ...row.events.map((event) => Number(event.startDate))
                    )
                )
            )
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
            this.startDate,
            true
        );
        this.monthAxis = this.getMonths(this.startDate, this.endDate);
        this.isHidden = new Array<Array<boolean>>(this.rows.length);
        this.isHidden.fill([], 0, this.isHidden.length);
        this.isHidden.forEach((numberOfRow, index) => {
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
    dateDifference(
        endDate: Date,
        startDate: Date,
        inlusiveOfEndDate: boolean = false
    ): number {
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

    getMonths(startDate: Date, endDate: Date): MonthAxis[] {
        const startMonth = startDate.getMonth();
        const endMonth = endDate.getMonth();
        const adjustedEndDate = this.addEndMonth(endDate);
        const totalDurationDays = this.dateDifference(
            startDate,
            adjustedEndDate,
            true
        );
        let months: MonthAxis[] = new Array();
        for (var i = 0; i <= endMonth - startMonth; i++) {
            const adjustedStartDate = this.addMonths(startDate, i);
            const monthName = this.getMonthName(adjustedStartDate);
            const daysInMonth = this.daysInMonth(adjustedStartDate);
            const monthDurationPercentage =
                (daysInMonth / totalDurationDays) * 100;
            months.push({
                monthName: monthName,
                monthDurationPercentage: monthDurationPercentage
            });
        }
        return months;
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
}
