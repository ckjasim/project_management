import { NextFunction } from "express";
import { Server, Socket } from "socket.io";

export default interface IChatController {
  teamListByEmployeeHandler: any;
  getChatsHandler:any
  markReadHandler:any

}