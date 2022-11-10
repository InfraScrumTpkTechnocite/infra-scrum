import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../models/project.model';
import { ProjectService } from '../../../../services/project.service';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-edit-deliverydate',
  templateUrl: './edit-deliverydate.component.html',
  styleUrls: ['./edit-deliverydate.component.css']
})
export class EditDeliverydateComponent {
  @Input() projectid!: string;
  @Input() project!: Project;

  isEditSprint: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  editSprint() {
    this.isEditSprint = !this.isEditSprint;
}
}
