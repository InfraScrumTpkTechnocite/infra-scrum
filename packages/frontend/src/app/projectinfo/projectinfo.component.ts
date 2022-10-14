import { Component, Input, OnInit } from '@angular/core';
import { UserProject } from '../models/userproject.model';

@Component({
  selector: 'app-projectinfo',
  templateUrl: './projectinfo.component.html',
  styleUrls: ['./projectinfo.component.css']
})
export class ProjectinfoComponent {
  @Input() userProject!: UserProject;
  isEditNewProject: boolean = false;
  selectedPictureFile?: File;

  constructor() { }

  ngOnInit(): void {
  }

  editProjectModel() {
    this.isEditNewProject = !this.isEditNewProject;
    console.log(`project name = ${this.userProject.project.name}, projet id = ${this.userProject.project.id}`)
  }

  onFileSelected(event: any) {
    this.selectedPictureFile = event.target.files[0];
    console.log(`Selected picture file : ${this.selectedPictureFile?.name}`);
  }
}
