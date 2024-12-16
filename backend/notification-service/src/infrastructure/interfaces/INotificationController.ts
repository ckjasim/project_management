import { NextFunction } from "express";
import { Server, Socket } from "socket.io";

export default interface INotificationController {
  getNotificationHandler: any;
  deleteNotificationHandler: any;
  getChatsHandler:any

}