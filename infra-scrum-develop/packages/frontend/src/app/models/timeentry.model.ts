export class TimeEntry {
  id?: string;
  taskid: string;
  workedtime: number;

  constructor() {
    this.taskid = '';
    this.workedtime = 0;
  }
}