import { Project } from "./project.model";
import { User } from "./user.model";

export class UserProject {
  id?: string;
  user: User;
  project: Project;

  constructor() {
    this.user = new User();
    this.project = new Project();
  }
}