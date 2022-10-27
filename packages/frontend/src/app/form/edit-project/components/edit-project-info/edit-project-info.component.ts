import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../../models/project.model';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-edit-project-info',
    templateUrl: './edit-project-info.component.html',
    styleUrls: ['./edit-project-info.component.css']
})
export class EditProjectInfoComponent implements OnInit {
    @Input() projectid!: string;
    @Input() project!: Project;
    enddate!: Date;
    fileName: string = '';

    constructor(
        private projectService: ProjectService,
        private toast: HotToastService,
        private httpClient: HttpClient
    ) {}

    ngOnInit(): void {}

    onSubmit() {
        const projectObserver = {
            next: (project: Project) => {
                this.toast.success('Project edited !');
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

    onFileSelected(event: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
            })
        };

        const file: File = event.target.files[0];
        const formData = new FormData();

        formData.append('file', file, this.project.id);

        console.table(event.target.files[0]);

        this.httpClient
            .post<any>(
                'http://localhost:4200/backend/image-upload/' + this.project.id,
                formData,
                httpOptions
            )
            .subscribe({
                next: (response) => {
                    console.log(response);
                },
                error: (err: any) => {},
                complete: () => {}
            });
    }
}
