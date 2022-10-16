import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class HeaderTitleService {
    constructor() {}

    title = new BehaviorSubject('InfraScrum');
    user = new BehaviorSubject(new User());

    setTitle(title: string) {
        this.title.next(title);
    }

    setUsername(user: User) {
        this.user.next(user);
    }
}
