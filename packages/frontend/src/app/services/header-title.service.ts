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
    userProjects = new BehaviorSubject([]);

    setTitle(title: string) {
        this.title.next(title);
    }

    setUsername(user: User) {
        this.user.next(user);
    }

    setUserProjects(userProjects: any) {
        this.userProjects.next(userProjects);
    }
}
