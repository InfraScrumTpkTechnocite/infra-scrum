import { Pipe, PipeTransform } from '@angular/core';
import { TimeEntry } from '../models/timeentry.model';

@Pipe({
    name: 'arrayReduce'
})
export class ArrayReducePipe implements PipeTransform {
    transform(timeEntries: TimeEntry[]): number {
        return timeEntries.reduce(
            (total, timeEntry) => total + timeEntry.workedtime,
            0
        );
    }
}
