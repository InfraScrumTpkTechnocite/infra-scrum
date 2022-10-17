import { Role } from "./role.model";

export class User {
    id? : string;
    username: string;
    password?: string;
    email: string;
    firstname?: string;
    lastname?: string;
    picture?: string;
    role: Role;

    constructor(){

        this.username = '';
        this.password = '';    
        this.email = '';
        this.firstname= '';
        this.lastname= '';
        this.picture= '';
        this.role = new Role();
    }
}