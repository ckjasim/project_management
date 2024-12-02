import mongoose, { Schema, Document, ObjectId } from "mongoose";
import ITask from "../../infrastructure/interfaces/ITask";

const taskSchema = new Schema<ITask>({
  project: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  team: { 
    type: Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  title: { type: String, required: [true, "Task title is required"] },
  description: { type: String },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'progressing', 'review', 'completed'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  dueDate: { type: Date, required: [true, "Due date is required"] },
}, { timestamps: true });

export const TaskModel = mongoose.model('Task', taskSchema);

