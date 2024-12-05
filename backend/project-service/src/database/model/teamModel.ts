import mongoose, { Schema, Document, ObjectId } from "mongoose";

import ITeam from "../../infrastructure/interfaces/ITeam";



const teamSchema = new Schema<ITeam>({
  name: { type: String, required: [true, "Team name is required"] },
  organization: { 
    type: Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  projectManager: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Employee' 
  }],
  eventHistory: { type: Object, default: {} },
}, { timestamps: true });

export const TeamModel = mongoose.model('Team', teamSchema);
