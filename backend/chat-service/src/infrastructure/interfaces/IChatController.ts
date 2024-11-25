import { NextFunction } from "express";
import { Server, Socket } from "socket.io";

export default interface IChatController {
  initializeSocket(
    io: Server, 
    socket: Socket, 
    next: NextFunction
  ): void;
}
