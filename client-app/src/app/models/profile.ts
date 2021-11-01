import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?:Photo[];//195
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

//195
export interface Photo{
    id:string;
    url:string;
    isMain:boolean;    
}