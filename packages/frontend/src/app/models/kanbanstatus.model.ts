export class Kanbanstatus {
  id?: string;
  name: string;
  color: string;
  projectid: string;

  constructor() {
    this.name = '';
    this.color = '#1F71A5';
    this.projectid = '';
  }
}