import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket  } from 'socket.io';
import cookieParser from 'cookie-parser';
import router from './infrastructure/routes/chatRouter';
import dbConnect from './database/dbConnect';
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { EmployeeCreateConsumer, TeamCreateConsumer, UserCreateConsumer } from './infrastructure/util/kafka/consumer/consumer';

import { config } from 'dotenv';
import container from './infrastructure/util/inversify';
import INTERFACE_TYPES from './infrastructure/constants/inversify';
import { ChatModel } from './database/model/chatModel';
config()
async function start() {
  try {
    
    dbConnect();
    await kafkaWrapper.connect();


    const ProjectConsumer = await kafkaWrapper.createConsumer('user-created');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created');
    const TeamConsumer = await kafkaWrapper.createConsumer('team-created');
    await ProjectConsumer.connect();
    await EmployeeConsumer.connect();
    await TeamConsumer.connect();
    console.log("Consumer connected successfully");

    const listener = new UserCreateConsumer(ProjectConsumer);
    const listener2 = new EmployeeCreateConsumer(EmployeeConsumer);
    const listener3 = new TeamCreateConsumer(TeamConsumer);

    await listener.listen(); // Start listening to messages
    await listener2.listen(); // Start listening to messages
    await listener3.listen(); // Start listening to messages
  } catch (error) {
    console.error("Error starting consumer:", error);
  }
}
start();

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

  socket.on('joinRoom',async (roomName)=>{
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  })

socket.on('message',async (message)=>{
  console.log(message,'messagee-----------------')
try {
  await ChatModel.create(message)
} catch (error) {
  console.log(error)
}
  if(message.type==='private'){
    const recipientSocketId = userSockets.get(message.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_message', message); 
    } else {
      console.log(`Recipient ${message.recipientId} is not connected`);
    }
  }else if(message.type==="group"){
    io.to(message.roomId).emit('new_message',message );
  }
})
});

app.use('/api', router);

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


