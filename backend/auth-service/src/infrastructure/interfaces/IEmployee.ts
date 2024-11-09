import { Document } from "mongoose";

export default interface IEmployee extends Document {
    name: string;  
    email: string; 
    password: string;  
    mobile:Number
    role: string; 
    isBlock?: boolean;
    jobRole:string
    projectCode:string
    img?:string;
  organization:string
}
