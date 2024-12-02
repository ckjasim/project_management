// import { injectable, inject } from 'inversify';
// import INTERFACE_TYPES from '../infrastructure/constants/inversify';

// import IChatController from '../infrastructure/interfaces/IChatController';
// import { Server, Socket } from 'socket.io';
// import ChatInteractor from '../interactors/ChatInteractor';
// import IUser from '../infrastructure/interfaces/IUser';

// interface Message {
//   id: string;
//   sender: string;
//   content: string;
//   timestamp: string;
//   type: 'group' | 'private';
//   room?: string;
//   recipient?: string;
// }

// @injectable()
// class ChatController implements IChatController {
//   private chatInteractor: ChatInteractor;
//   private readonly MAX_ONLINE_USERS = 100;
//   private static readonly MAX_EVENT_LISTENERS = 15;

//   constructor(
//     @inject(INTERFACE_TYPES.ChatInteractor) chatInteractor: ChatInteractor
//   ) {

//     this.chatInteractor = chatInteractor;
//   }

//   initializeSocket(io: Server): void {
//     io.setMaxListeners(ChatController.MAX_EVENT_LISTENERS);

//     io.on('connection', (socket: Socket) => {


//       socket.setMaxListeners(ChatController.MAX_EVENT_LISTENERS);
//       this.registerSocketEvents(io, socket);
//     });
//   }

//   private registerSocketEvents(io: Server, socket: Socket): void {
//     socket.on('register', async (username: string) => {
      
//       console.log('55555555555555')
//       if (!username || typeof username !== 'string') {
//         socket.emit('error', { message: 'Invalid username.' });
//         return;
//       }
//       try {
//         console.log(username,'1212121212121212121212121212')
//         const existingUser = await this.chatInteractor.getUserByUserName(username);
      
//  console.log(existingUser,'13131313131313131')
    
//         if (existingUser ) {
//           const updatedUser = await this.chatInteractor.updateSocketId(username, socket.id);
      
          
          
//           socket.emit('username_registered', username); 
//         } else {
          


//           const newUser: Partial<IUser> = { userName: username, socketId: socket.id };

//           await this.chatInteractor.createUser(newUser);

//           socket.emit('username_registered', username);  
//         }
    
//         // After successful registration or update, broadcast online users
//         this.broadcastOnlineUsers(io);
//       } catch (error) {
//         // Log the error for debugging and emit a message to the client
//         console.error('Error handling registration:', error);
//         socket.emit('error', { message: 'Error registering username.' });
//       }
//     });
    

//     socket.on('unregister', async (username: string) => {
//       if (!username) {
//         socket.emit('error', { message: 'Invalid username.' });
//         return;
//       }

//       try {
//         await this.chatInteractor.deleteUserBySocketId(socket.id);
//         this.broadcastOnlineUsers(io);
//       } catch (error) {
//         socket.emit('error', { message: 'Error unregistering user.' });
//       }
//     });

//     socket.on('join room', (room: string) => {
//       if (!room || typeof room !== 'string') {
//         socket.emit('error', { message: 'Room name is required and must be a string.' });
//         return;
//       }

//       socket.join(room);
//       console.log(`Socket ${socket.id} joined room: ${room}`);
//       io.to(room).emit('room joined', { room, user: socket.id });
//     });

//     socket.on('leave room', (room: string) => {
//       if (!room || typeof room !== 'string') {
//         socket.emit('error', { message: 'Room name is required and must be a string.' });
//         return;
//       }

//       socket.leave(room);
//       console.log(`Socket ${socket.id} left room: ${room}`);
//       io.to(room).emit('room left', { room, user: socket.id });
//     });

//     socket.on('group message', (data: { room: string; message: Message }) => {
//       if (!data || !data.room || !data.message) {
//         socket.emit('error', { message: 'Room and message data are required.' });
//         return;
//       }

//       if (!io.sockets.adapter.rooms.get(data.room)) {
//         socket.emit('error', { message: 'Room does not exist.' });
//         return;
//       }

//       io.to(data.room).emit('group message', data.message);

//     });
//     socket.on('private message', async (data: { to: string; message: Message }) => {
//       try {
//         // Validate input
//         if (!data || !data.to || !data.message) {
//           socket.emit('error', { message: 'Recipient and message data are required.' });
//           return;
//         }
    
//         // Retrieve the recipient user
//         const targetUser = await this.chatInteractor.getUserByUserName(data.to);
    
//         if (targetUser) {
//           console.log(targetUser, 'Recipient found with socketId');
    
//           const recipientSocketId = targetUser.socketId;
    
//           // Send the private message to the recipient
//           io.to(recipientSocketId).emit('private message', data.message);
//         } else {
//           socket.emit('error', { message: 'Recipient is offline or does not exist.' });
//         }
//       } catch (error) {
//         console.error('Error sending private message:', error);
//         socket.emit('error', { message: 'Error sending private message.' });
//       }
//     });
    

//     socket.on('disconnect', () => {
//       this.cleanupUser(socket.id);
//       this.broadcastOnlineUsers(io);
//     });

//     // Ensure listeners are removed on disconnect to prevent memory leaks
//     socket.on('removeAllListeners', () => {
//       socket.removeAllListeners();
//     });
//   }

//   private broadcastOnlineUsers(io: Server): void {
//     this.chatInteractor.getAllUsers().then(users => {
//       const onlineUsers = users?.map(user => user?.userName);
//       io.emit('online users', onlineUsers);

//     }).catch(error => {
//       console.error('Error broadcasting online users:', error);
//     });
//   }

//   private cleanupUser(socketId: string): void {
//     this.chatInteractor.deleteUserBySocketId(socketId)
//       .then(() => console.log(`User disconnected and removed from online users.`))
//       .catch(error => console.error('Error cleaning up user:', error));
//   }
// }

// export default ChatController;

// Backend Socket Controller (Node.js with Socket.io)
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

// Extend Socket interface
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