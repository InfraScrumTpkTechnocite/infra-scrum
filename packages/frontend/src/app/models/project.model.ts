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

    constructor(project? : Project) {
        this.id = project?.id;
        this.name = project?.name ?? "New Project";
        this.description = project?.description;
        this.project = project?.project;
        this.githuburl = project?.githuburl;
        this.githubtoken = project?.githubtoken;
        this.startdate = project?.startdate ?? new Date().toISOString();
        this.enddate = project?.enddate ?? new Date().toISOString();
        this.picture = project?.picture;
    }
}
