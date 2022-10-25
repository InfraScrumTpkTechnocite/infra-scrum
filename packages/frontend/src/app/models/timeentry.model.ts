import { Task } from "./task.model";

export class TimeEntry {
  id?: string;
  task: Task;
  workedtime: number;

  constructor() {
    this.task = new Task();
    this.workedtime = 0;
  }
}