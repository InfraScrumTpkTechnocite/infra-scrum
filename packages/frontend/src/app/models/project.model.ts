export class Project {
    id?: string;
    name: string;
    description: string;
    project?: Project;
    githuburl: string;
    githubtoken: string;
    startdate: string;
    enddate: string;
    picture: string;

    constructor() {
        this.name = "New Project";
        this.description = '';
        this.githuburl = "https://github.com";
        this.githubtoken = '';
        this.startdate = new Date().toISOString();
        this.enddate = new Date().toISOString();;
        this.picture = '';
    }
}
