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
        this.name = '';
        this.description = '';
        this.githuburl = '';
        this.githubtoken = '';
        this.startdate = '';
        this.enddate = '';
        this.picture = '';
    }
}
