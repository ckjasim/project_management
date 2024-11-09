import mongoose, { Schema, Document, ObjectId } from "mongoose";

import IProject from "../../infrastructure/interfaces/IProject";

const projectSchema = new mongoose.Schema<IProject>({
  userEmail:{ type: String, required: [true, "User email is required"] },
  projectName: { type: String, required: [true, "Project name is required"] },
  projectCode: { type: String, required: [true, "Project code is required"] },
  summary: { type: String, required: [true, "Summary is required"] },
  description: { type: String },
  teamId: { type: Schema.Types.ObjectId, required: [true, "Team ID is required"] },
  dueDate: { type: Date, required: [true, "Due date is required"] },
  isActive: { type: Boolean, default: true },
  eventHistory: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ProjectModel = mongoose.model<IProject>("Project", projectSchema);