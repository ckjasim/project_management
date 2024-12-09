import { NextFunction } from "express";
import { Server, Socket } from "socket.io";

export default interface IChatController {
  initializeSocketServer(io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>, socket: Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>, arg2: () => void): unknown;
  initializeSocket(
    io: Server, 
    socket: Socket, 
    next: NextFunction
  ): void;
}