import { Topics } from '../topics/topics';

export interface TaskCreateEvent {
  topic: Topics.taskCreated;
  data: {
    _id:string;
    project: string;
    team: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status?: 'pending' | 'progressing' | 'review' | 'completed';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    dueDate: Date;
  };
}
