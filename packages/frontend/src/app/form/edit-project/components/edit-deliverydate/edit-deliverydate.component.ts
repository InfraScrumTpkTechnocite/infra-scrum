import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../models/project.model';
import { ProjectService } from '../../../../services/project.service';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-edit-deliverydate',
  templateUrl: './edit-deliverydate.component.html',
  styleUrls: ['./edit-deliverydate.component.css']
})
export class EditDeliverydateComponent implements OnInit {
  @Input() projectid!: string;
  @Input() project!: Project;
  constructor(
    private projectService: ProjectService,
    private toastService: HotToastService
  ) { }

  ngOnInit(): void {
  }
  onSubmit() {
    const projectObserver = {
        next: (project: Project) => {
            this.toastService.success('Project edited !');
        },
        error: (err: any) => {
            console.log(
                `Erreur édition projet : ${err.error['driverError'].detail}`
            );
            this.toastService.error(
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
