import { Document } from "mongoose";

export default interface IUser extends Document {

    userName: string;  
    socketId: string; 
    
}
