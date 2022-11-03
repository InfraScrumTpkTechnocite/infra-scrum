import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProject } from '../../models/userproject.model';
import { UserprojectService } from '../../services/userproject.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
    projectid!: string;
    project: Project = new Project();
    userList!: User[];
    userProjectList!: UserProject[];
    switch: string = 'default';

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private userService: UserService,
        private userProjectService: UserprojectService
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            let paramsObject: any = { ...params.keys, ...params };
            this.projectid = paramsObject.params.projectid;
        });
        this.projectService
            .findOne(this.projectid)
            .subscribe((project: Project) => (this.project = project));
        this.userService
            .getAllUsers()
            .subscribe((userList: User[]) => (this.userList = userList));
        this.userProjectService
            .findCurrentProjectUsers(this.projectid)
            .subscribe(
                (userProjectList: UserProject[]) =>
                    (this.userProjectList = userProjectList)
            );
    }
}
