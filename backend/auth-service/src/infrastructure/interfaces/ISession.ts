
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userData?: {
      name: string;
      email: string;
      password:string;
      role:string;
      isBlock:boolean
      
    };
  }
}
