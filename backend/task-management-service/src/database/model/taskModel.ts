import mongoose, { Schema, Document } from "mongoose";
import ITask from "../../infrastructure/interfaces/ITask";

const taskSchema = new Schema<ITask>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    status: {
      type: String,
      enum: ['pending', 'progressing', 'review', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    attachments: [
      {
        public_id: { type: String },
        name: { type: String },
        size: { type: String },
        url: { type: String },
      },
    ],
    comments: [
      new Schema(
        {

          authorModel: {
            type: String,
            required: true,
            enum: ['Employee', 'User'],
          },
          author: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'comments.authorModel',
          },
          content: {
            type: String,
          },
        },
        { timestamps: true } 
      ),
    ],
  },
  { timestamps: true } 
);

export const TaskModel = mongoose.model<ITask & Document>('Task', taskSchema);
