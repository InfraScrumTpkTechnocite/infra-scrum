import { Component, Input} from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../../models/project.model';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-edit-project-info',
    templateUrl: './edit-project-info.component.html',
    styleUrls: ['./edit-project-info.component.css']
})
export class EditProjectInfoComponent {
    @Input() projectid!: string;
    @Input() project!: Project;
    enddate!: Date;
    fileName: string = '';

    constructor(
        private projectService: ProjectService,
        private httpClient: HttpClient,
        private toastService: HotToastService
    ) {}
    onFileSelected(event: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token')
            })
        };

        const file: File = event.target.files[0];
        const formData = new FormData();

        formData.append('file', file, this.project.id);

        //console.table(event.target.files[0]);

        this.httpClient
            .post<any>(
                'http://localhost:4200/backend/projects/image-upload/' +
                    this.project.id,
                formData,
                httpOptions
            )
            .subscribe({
                next: (response) => {
                    this.toastService.success('Project picture updated !');
                    //console.log(response);
                },
                error: (err: any) => {
                    this.toastService.error(err.error.message);
                },
                complete: () => {}
            });
    }
}
