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
  firstname: 'Gilles',
  lastname: '',
  password: 'gilles',
  picture: '',
  role: 'acf42287-aaaa-48b5-ae6e-ebc75e2a275f',
};
