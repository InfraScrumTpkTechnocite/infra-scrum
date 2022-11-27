import { Task } from "./task.model";
import { UserProject } from "./userproject.model";

export class TaskAssignment {
  id?: string;
  userproject: UserProject;
  task: Task;
  isTaskCreator: boolean;

  constructor(userProject: UserProject, task:Task) {
    this.userproject = userProject ?? new UserProject();
    this.task = task ?? new Task();
    this.isTaskCreator = false;
  }
}