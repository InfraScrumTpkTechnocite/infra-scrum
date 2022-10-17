export class Project {
    id?: string;
    name: string;
    description?: string;
    project?: Project;
    githuburl?: string;
    githubtoken?: string;
    startdate: string;
    enddate?: string;
    picture?: string;

    constructor() {
        this.name = "New Project";
        this.startdate = new Date().toISOString();
    }
}
