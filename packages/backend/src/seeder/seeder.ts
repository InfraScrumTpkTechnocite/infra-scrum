import { Project } from 'src/projects/project.entity';

export const seederRoles: any = [
  { name: 'superadmin' },
  { name: 'admin' },
  { name: 'employee' },
  { name: 'trainee' },
];

export const seederUser: any = {
  username: 'gilles',
  email: 'gilles@triptyk.eu',
  firstname: 'Gilles',
  lastname: '',
  password: 'gilles',
  picture: 'zrzerzer',
  role: 'acf42287-aaaa-48b5-ae6e-ebc75e2a275f',
};

export const seederProjects: any[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    projectname: 'null-project',
    project: '00000000-0000-0000-0000-000000000000',
  },
];
