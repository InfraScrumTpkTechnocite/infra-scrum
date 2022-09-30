export class Project {
  id?: string;
  name: string;
  description: string;
  project?: string
  githuburl: string;
  githubtoken: string;
  startdate: string;
  enddate: string;
  picture: string;

  constructor() {
    this.name = '';
    this.description = '';
    this.project = '00000000-0000-0000-0000-000000000000';//projet "normal" par défault (pas un sous-projet/sprint)
    this.githuburl = '';
    this.githubtoken = '';
    this.startdate = '';
    this.enddate = '';
    this.picture = '';
  }
}