import mongoose from "mongoose";

import IDrive from "../../infrastructure/interfaces/IDrive";


const driveSchema = new mongoose.Schema<IDrive>({
  email: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  accessToken: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  refreshToken: { 
    type: String, 

  },
  organization: { 
    type: String, 

  },
  
}, { timestamps: true });



export const DriveModel = mongoose.model('Drive', driveSchema);
