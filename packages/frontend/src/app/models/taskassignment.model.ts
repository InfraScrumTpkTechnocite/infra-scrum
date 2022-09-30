export class TaskAssignment {
  id?: string;
  userprojectid: string;
  taskid: string;

  constructor() {
    this.userprojectid = '';
    this.taskid = '';
  }
}