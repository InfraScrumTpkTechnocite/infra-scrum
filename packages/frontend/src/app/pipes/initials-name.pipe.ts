import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initialsName'
})
export class InitialsNamePipe implements PipeTransform {
    transform(fullName: string): any {
        return fullName
            .split(' ')
            .map((n) => n[0])
            .join('');
    }
}
