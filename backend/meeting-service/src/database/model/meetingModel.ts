import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IMeeting } from "../../infrastructure/interfaces/IMeeting";



const meetingSchema = new Schema<IMeeting>({
  title: { 
    type: String, 
    required: [true, "Meeting title is required"] 
  },
  // description: { 
  //   type: String 
  // },  
  teams: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  }],
  organizer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  // attendees: [{ 
  //   type: Schema.Types.ObjectId, 
  //   ref: 'Employee' 
  // }],
  date: { 
    type: Date, 
    required: [true, "Meeting date is required"] 
  },
  time: { 
    type: String, 
    required: [true, "Meeting time is required"] 
  },
  duration: { 
    type: String, 
    required: [true, "Meeting duration is required"] 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  meetingLink: { 
    type: String 
  }
}, { timestamps: true });

export const MeetingModel = mongoose.model('Meeting', meetingSchema);