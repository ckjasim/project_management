import { Document } from "mongoose";

export default interface IUser extends Document {
    name: string;  
    email: string; 
    password: string;  
    role: string; 
    isBlock?: boolean;
    organization:string
    
}
