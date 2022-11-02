import { Project } from 'src/projects/project.entity';

export const seederRoles: any = [
  { name: 'superadmin' },
  { name: 'admin' },
  { name: 'employee' },
  { name: 'intern' },
  { name: 'guest' },
];

export const seederUser: any = {
  username: 'gilles',
  email: 'gilles@triptyk.eu',
  firstname: 'gilles',
  lastname: 'bertrand',
  password: 'gilles',
  picture: '',
  role: 'f5d033ee-d60d-4d52-8366-e3295cd71ef3',
};
