import { Project } from './project.model';

export class Kanbanstatus {
    id?: string;
    name: string;
    color: string;
    project: Project;
    order: number;
    isTypeDone: boolean;

    constructor() {
        this.name = 'New Column';
        this.color = '#1F71A5';
        this.project = new Project();
        this.order = 0;
        this.isTypeDone = false;
    }
}
