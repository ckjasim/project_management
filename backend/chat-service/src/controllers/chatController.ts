import { injectable, inject } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IJwt from '../infrastructure/interfaces/IJwt';
import IChatController from '../infrastructure/interfaces/IChatController';
import { Server, Socket } from 'socket.io';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'group' | 'private';
  room?: string;
  recipient?: string;
}

@injectable()
class ChatController implements IChatController {
  private jwt: IJwt;
  private users: Map<string, string>; // Maps usernames to socket IDs
  private readonly MAX_ONLINE_USERS = 100;
  private static readonly MAX_EVENT_LISTENERS = 15;

  constructor(@inject(INTERFACE_TYPES.jwt) jwt: IJwt) {
    this.jwt = jwt;
    this.users = new Map();
  }

  initializeSocket(io: Server): void {
    io.setMaxListeners(ChatController.MAX_EVENT_LISTENERS);

    io.on('connection', (socket: Socket) => {
      console.log(`New connection: ${socket.id}`);

      socket.setMaxListeners(ChatController.MAX_EVENT_LISTENERS);
      this.registerSocketEvents(io, socket);
    });
  }

  private registerSocketEvents(io: Server, socket: Socket): void {
    socket.on('register', (username: string) => {
      if (!username) return;

    

      if (this.users.size >= this.MAX_ONLINE_USERS) {
        socket.emit('error', { message: 'Server capacity reached. Try again later.' });
        return;
      }

 
        socket.emit('username_changed', username);


      this.users.set(username, socket.id);
      this.broadcastOnlineUsers(io);
    });

    socket.on('unregister', (username: string) => {
      this.users.delete(username);
      this.broadcastOnlineUsers(io);
    });

    socket.on('join room', (room: string) => {
      if (!room) {
        socket.emit('error', { message: 'Room name is required.' });
        return;
      }

      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
    socket.on('leave room', (room: string) => {
      console.log(`Socket ${socket.id} left room: ${room}`);
      socket.leave(room);
    });

    socket.on('group message', (data: { room: string; message: Message }) => {
      console.log(data,'jaaaaaaaaaaaaaasiii')
      console.log(`Room membership check for ${data.room}:`, io.sockets.adapter.rooms.get(data.room));
      if (!data.room || !data.message) {
        socket.emit('error', { message: 'Room and message data are required.' });
        return;
      }
      io.to(data.room).emit('group message', data.message);
      console.log('allllaaa')
    });

    socket.on('private message', (data: { to: string; message: Message }) => {
      const targetSocketId = this.users.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('private message', data.message);
      } else {
        socket.emit('error', { message: 'Recipient is offline or does not exist.' });
      }
    });

    socket.on('disconnect', () => {
      this.cleanupUser(socket.id);
      this.broadcastOnlineUsers(io);
    });
  }

  // private ensureUniqueUsername(base: string): string {
  //   let uniqueName = base;
  //   let counter = 1;
  //   while (this.users.has(uniqueName)) {
  //     uniqueName = `${base}_${counter}`;
  //     counter++;
  //   }
  //   return uniqueName;
  // }

  private broadcastOnlineUsers(io: Server): void {
    io.emit('online users', Array.from(this.users.keys()));
  }

  private cleanupUser(socketId: string): void {
    for (const [username, id] of this.users.entries()) {
      if (id === socketId) {
        this.users.delete(username);
        break;
      }
    }
  }
}

export default ChatController;
