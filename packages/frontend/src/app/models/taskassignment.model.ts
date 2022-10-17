import { Task } from "./task.model";
import { UserProject } from "./userproject.model";

export class TaskAssignment {
  id?: string;
  userproject: UserProject;
  task: Task;

  constructor() {
    this.userproject = new UserProject();
    this.task = new Task();
  }
}