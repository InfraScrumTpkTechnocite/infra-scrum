import { Kanbanstatus } from "./kanbanstatus.model";
import { Project } from "./project.model";
import { TaskType } from "./tasktype.model";

export class Task {
  id?: string;
  name: string;
  kanbanstatus: Kanbanstatus;
  task?: Task;
  description: string;
  startdate: string;
  estimatedtime: number;
  file: string;
  done: boolean;
  tasktype: TaskType;
  color: string;
  sprint?: Project | null;

  constructor() {
    this.name = '';
    this.kanbanstatus = new Kanbanstatus();
    this.description = '';
    this.startdate = '';
    this.estimatedtime = 0;
    this.file = '';
    this.done = false;
    this.tasktype = new TaskType();
    this.color = '#1F71A5';
  }
}