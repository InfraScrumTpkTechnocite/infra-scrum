import { TaskType } from "./tasktype.model";

export class Task {
  id?: string;
  name: string;
  kanbanstatus: string;
  task?: Task;
  description: string;
  startdate: string;
  estimatedTime: number;
  file: string;
  done: boolean;
  tasktype: TaskType;

  constructor() {
    this.name = '';
    this.kanbanstatus = '';
    this.description = '';
    this.startdate = '';
    this.estimatedTime = 0;
    this.file = '';
    this.done = false;
    this.tasktype = new TaskType();
  }
}