import { Project } from "./project.model";

export class Kanbanstatus {
  id?: string;
  name: string;
  color: string;
  project: Project;

  constructor() {
    this.name = '';
    this.color = '#1F71A5';
    this.project = new Project();
  }
}