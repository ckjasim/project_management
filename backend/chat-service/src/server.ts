import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket  } from 'socket.io';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const userSockets = new Map<string, string>();

io.on('connection', (socket: Socket) => {
  console.log('New user connected');
  const userId = socket.handshake.query.userId
  console.log('User connected with ID:', userId);
  userSockets.set(userId as string,socket.id)


socket.on('message',async (message)=>{console.log(message,'messagee-----------------')
  const recipientSocketId = userSockets.get(message.recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('new_message', message); 
  } else {
    console.log(`Recipient ${message.recipientId} is not connected`);
  }
})
});



const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


