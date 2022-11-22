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

  constructor( task?: Task ) {
    this.name = task?.name ?? 'New Task';
    this.kanbanstatus = task?.kanbanstatus ?? new Kanbanstatus();
    this.description = task?.description ??'';
    this.startdate = task?.startdate ?? new Date().toISOString();
    this.estimatedtime = task?.estimatedtime ?? 0;
    this.file = task?.file ?? '';
    this.done = task?.done ?? false;
    this.tasktype = task?.tasktype ?? new TaskType();
    this.color = task?.color ?? '#1F71A5';
    this.sprint = task?.sprint ?? new Project();
  }
}