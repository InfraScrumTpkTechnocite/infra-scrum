export class User {
    id? : string;
    username: string;
    password: string;
    email: string;
    firstname?: string;
    lastname?: string;
    picture?: string;
    role: string;

    constructor(){

        this.username = '';
        this.password = '';    
        this.email = '';
        this.firstname= '';
        this.lastname= '';
        this.picture= '';
        this.role= '30490934-0e02-4378-8f08-87a23ee20ac5'; //Logique des Roles à mettre en place
    
    }

}