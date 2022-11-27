import { TaskAssignment } from "./taskassignment.model";

export class TimeEntry {
  id?: string;
  taskassignment!: TaskAssignment;
  workedtime: number;
  dayofwork: string;

  constructor(taskAssignment : TaskAssignment) {
    this.taskassignment = taskAssignment ?? undefined; 
    this.workedtime = 0;
    this.dayofwork = new Date().toISOString();
  }
}