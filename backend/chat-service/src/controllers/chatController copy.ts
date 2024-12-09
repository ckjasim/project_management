
import { NextFunction } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import { inject, injectable } from "inversify";
import IChatController from "../infrastructure/interfaces/IChatController";
import INTERFACE_TYPES from "../infrastructure/constants/inversify";
import ChatInteractor from "../interactors/ChatInteractor";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'group' | 'private';
  roomId?: string;
  recipientId?: string;
}

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

@injectable()
class ChatController implements IChatController {
  private io?: SocketIOServer;
  private chatInteractor: ChatInteractor;

  constructor(
    @inject(INTERFACE_TYPES.ChatInteractor) chatInteractor: ChatInteractor
  ) {
    this.chatInteractor = chatInteractor;
    
  }

  initializeSocketServer(server: any): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupSocketListeners();
    return this.io;
  }

  private setupSocketListeners(): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }

    this.io.on('connection', (socket: Socket) => {
      this.initializeSocket(this.io!, socket, () => {});
    });
  }

  initializeSocket(io: SocketIOServer, socket: Socket, next: NextFunction): void {
    console.log('New client connected');

    // User registration
    socket.on('register', async (data: { userId: string }) => {
      const { userId } = data;
      
      if (!userId) {
        socket.emit('error', { message: 'User ID is required' });
        return;
      }

      try {
        // Optional: Use chatInteractor for user registration logic if needed
        // await this.chatInteractor.registerUser(userId);

        // Store user's socket connection
        (socket as any).userId = userId;
        socket.join(userId);

        console.log(`User ${userId} registered`);
      } catch (error) {
        console.error('Registration error:', error);
        socket.emit('error', { message: 'Registration failed' });
      }
    });

    // Join room
    socket.on('join_room', async (roomId: string) => {
      if (!roomId) {
        socket.emit('error', { message: 'Room ID is required' });
        return;
      }

      try {
        socket.join(roomId);
        console.log(`Socket joined room: ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave_room', async (roomId: string) => {
      if (!roomId) {
        socket.emit('error', { message: 'Room ID is required' });
        return;
      }

      try {
        socket.leave(roomId);
        console.log(`Socket left room: ${roomId}`);
      } catch (error) {
        console.error('Leave room error:', error);
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    // Send message
    socket.on('send_message', async (message: Message) => {
      // Validate message
      if (!message || !message.senderId) {
        socket.emit('error', { message: 'Invalid message format' });
        return;
      }

      try {
        if (message.type === 'group' && message.roomId) {
          // Broadcast to room
          io.to(message.roomId).emit('new_message', message);
        } else if (message.type === 'private' && message.recipientId) {
          // Send to specific recipient
          io.to(message.recipientId).emit('new_message', message);
        } else {
          socket.emit('error', { message: 'Invalid message type or recipient' });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = (socket as any).userId;
      console.log(`Client disconnected: ${userId}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    next();
  }

  // Optional: Method to get the Socket.IO server instance
  getIO(): SocketIOServer | undefined {
    return this.io;
  }
}

export default ChatController;