export class Task {
  id?: string;
  name: string;
  kanbanstatus: string;
  task?: string;
  description: string;
  startdate: string;
  estimatedTime: number;
  file: string;
  done: boolean;
  tasktype: string;

  constructor() {
    this.name = '';
    this.kanbanstatus = '';
    this.description = '';
    this.startdate = '';
    this.estimatedTime = 0;
    this.file = '';
    this.done = false;
    this.tasktype = '';
  }
}