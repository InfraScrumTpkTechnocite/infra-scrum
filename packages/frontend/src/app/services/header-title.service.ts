import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderTitleService {
    constructor() {}

    title = new BehaviorSubject('InfraScrum');

    setTitle(title: string) {
        this.title.next(title);
    }
}
