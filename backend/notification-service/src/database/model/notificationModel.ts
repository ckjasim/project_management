import mongoose, { Schema } from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },  
  data: { type: Object, required: true },  
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now } 
});

export const NotificationModel = mongoose.model('Notification', notificationSchema);