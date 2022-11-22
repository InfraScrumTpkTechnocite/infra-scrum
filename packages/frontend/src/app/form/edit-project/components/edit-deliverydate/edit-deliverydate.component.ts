import { Component, OnInit, Input } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from '../../../../models/project.model';

export interface Sprint {
    sprint: Project;
    isEdit: boolean;
}

@Component({
    selector: 'app-edit-deliverydate',
    templateUrl: './edit-deliverydate.component.html',
    styleUrls: ['./edit-deliverydate.component.css']
})
export class EditDeliverydateComponent implements OnInit {
    @Input() sprintList!: Project[];

    sprints: Sprint[] = [];

    constructor(
        private projectService: ProjectService,
        private toastService: HotToastService
    ) {}

    ngOnInit(): void {
        this.sprintList.map((sprint) => {
            console.log(sprint);

            this.sprints.push({ sprint: new Project(sprint), isEdit: false });
        });
    }

    updateDate(event: any, date: string): string {
        date = new Date(event).toISOString();
        return date;
    }

    cancel(index: number) {
        this.sprints[index].sprint = new Project(this.sprintList[index]);
        this.sprints[index].isEdit = false;
    }

    setDates(index: number) {
        this.projectService.update(this.sprints[index].sprint).subscribe({
            next: () => {},
            error: (err: any) => {
                this.toastService.error(`Error during sprint edition<br><br>${err.error.driverError.detail}`);
            },
            complete: () => {
                this.toastService.success('Sprint edited');
                this.sprintList[index] = this.sprints[index].sprint;
                this.sprints[index].isEdit = false;
            }
        });
    }

    delete(index: number){
        this.projectService.delete(this.sprints[index].sprint.id!).subscribe({
            next: () => {},
            error: (err: any) => {
                this.toastService.error(`Error during sprint deletion<br><br>${err.error.driverError.detail}`);
            },
            complete: () => {
                this.toastService.success('Sprint edited');
                this.sprintList.splice(index,1);
                this.sprints.splice(index,1);
            }
        });
    }
}
