export class UserProject {
  id?: string;
  user: string;
  project: string;
  isprojectadmin: boolean;

  constructor() {
    this.user = '';
    this.project = '';
    this.isprojectadmin = false;
  }
}