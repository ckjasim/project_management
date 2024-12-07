

import { Topics } from "../topics/topics";

export interface ProjectCreateEvent {
    topic: Topics.projectCreated;
    data: {
      _id:string
      title: string;
      priority: string;
      description?: string;
      organization: any;
      teams:any
      projectManager:any  ;
      dueDate: Date;
      eventHistory?: Record<string, any>;
    };
}











