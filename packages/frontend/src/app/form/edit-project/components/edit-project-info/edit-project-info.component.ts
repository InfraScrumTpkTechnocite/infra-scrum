import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../../models/project.model';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'app-edit-project-info',
    templateUrl: './edit-project-info.component.html',
    styleUrls: ['./edit-project-info.component.css']
})
export class EditProjectInfoComponent implements OnInit {
    @Input() projectid!: string;
    @Input() project!: Project;
    enddate!: Date;

    constructor(
        private projectService: ProjectService,
        private toast: HotToastService
    ) {}

    ngOnInit(): void {}

    onSubmit() {

        const projectObserver = {
            next: (project: Project) => {
                this.toast.success(
                    'Project edited !'
                );
            },
            error: (err: any) => {
                console.log(
                    `Erreur édition projet : ${err.error['driverError'].detail}`
                );
                this.toast.error(
                    `Error during project edition<br><br>${err.error.driverError.detail}`
                );
            },
            complete: () => {
                console.log(`edit-project - onSubmit - update terminé.`);
            }
        };


        this.projectService.update(this.project).subscribe(projectObserver);
    }
}
