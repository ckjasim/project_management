import mongoose, { Schema, Document, ObjectId } from "mongoose";

import IProject from "../../infrastructure/interfaces/IProject";



const projectSchema = new Schema<IProject>({
  title: { type: String, required: [true, "Project title is required"] },
  description: { type: String },
  organization: { 
    type: Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  teams: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Team' 
  }],
  projectManager: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  startDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: [true, "Due date is required"] },
  priority: { type: String, required: [true, "priority is required"] },
  eventHistory: { type: Object, default: {} },
  status: { 
    type: String, 
    enum: ['planning', 'in_progress', 'completed', 'on_hold'], 
    default: 'planning' 
  },
}, { timestamps: true });

export const ProjectModel = mongoose.model('Project', projectSchema);