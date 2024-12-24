

import { Topics } from "../topics/topics";

export interface ProjectCreateEvent {
    topic: Topics.projectCreated;
    data: {
      _id:string
      title: string;
      priority: string;
      description?: string;
      organization: string;
      teams: {
        team:string;
      }[];
      projectManager:string;
      startDate?: Date;
      dueDate: Date;
      eventHistory?: Record<string, any>;
      status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
      createdAt?: Date;
      updatedAt?: Date;
    };
}











