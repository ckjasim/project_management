import mongoose, { Schema, Document, ObjectId } from "mongoose";

import ITask from "../../infrastructure/interfaces/ITask";

const taskSchema = new mongoose.Schema<ITask>({
  // projectId: { type: Schema.Types.ObjectId, required: true },
  projectCode: { type: String, required: [true, "Project code is required"] },
  topic: { type: String, required: [true, "Topic is required"] },
  summary: { type: String, required: [true, "Summary is required"] },
  description: { type: String },
  photo: { type: Buffer },
  dueDate: { type: Date, required: [true, "Due date is required"] },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed','Review'], default: 'Pending' },
});

export const TaskModel = mongoose.model<ITask>("Task", taskSchema);
