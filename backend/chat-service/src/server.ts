import express from 'express';
import 'reflect-metadata';
import cors from 'cors';  
import { createServer } from 'http';
import { Server, Socket  } from 'socket.io';
import cookieParser from 'cookie-parser';
import router from './infrastructure/routes/chatRouter';
import dbConnect from './database/dbConnect';
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { EmployeeCreateConsumer, EmployeeUpdatedConsumer, TeamCreateConsumer, UserCreateConsumer, UserUpdatedConsumer } from './infrastructure/util/kafka/consumer/consumer';

import { config } from 'dotenv';

import { ChatModel } from './database/model/chatModel';
import { ChatCreatedPublisher } from './infrastructure/util/kafka/producer/producer';
import { Producer } from 'kafkajs';
config()
async function start() {
  try {
    
    dbConnect();
    await kafkaWrapper.connect();


    const UserConsumer = await kafkaWrapper.createConsumer('user-created-for-chat');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created-for-chat');
    const UserUpdateConsumer = await kafkaWrapper.createConsumer('user-updated-for-chat');
    const EmployeeUpdateConsumer = await kafkaWrapper.createConsumer('employee-updated-for-chat');
    const TeamConsumer = await kafkaWrapper.createConsumer('team-created-for-chat');
    await UserConsumer.connect();
    await UserUpdateConsumer.connect();
    await EmployeeConsumer.connect();
    await EmployeeUpdateConsumer.connect();
    await TeamConsumer.connect();
    console.log("Consumer connected successfully");

    const listener1 = new UserCreateConsumer(UserConsumer);
    const listener2= new UserUpdatedConsumer(UserUpdateConsumer);
    const listener4= new EmployeeUpdatedConsumer(EmployeeUpdateConsumer);
    const listener3 = new EmployeeCreateConsumer(EmployeeConsumer);
    const listener5 = new TeamCreateConsumer(TeamConsumer);
    
   

    await listener1.listen();
    await listener2.listen(); 
    await listener3.listen(); 
    await listener4.listen(); 
    await listener5.listen(); 
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

socket.on('file',async (message)=>{

try {
 const chat= await ChatModel.create(message)
     
 if (chat) {
  await new ChatCreatedPublisher(
    kafkaWrapper.producer as Producer 
  ).produce({
    _id:chat._id as string,
    content:"photo",
    id: chat.id as unknown as string,
    recipientId:chat.recipientId as string,
    roomId:chat.roomId as  string,
    senderId:chat.senderId as string,
    senderName:chat.senderName as string,
    type: chat.type as unknown as string, 
    
  });
}
} catch (error) {
  console.log(error)
}
  if(message.type==='private'){
    const recipientSocketId = userSockets.get(message.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_file', message); 
    } else {
      console.log(`Recipient ${message.recipientId} is not connected`);
    }
  }else if(message.type==="group"){
    io.to(message.roomId).emit('new_file',message );
  }

})
socket.on('message',async (message)=>{

try {
 const chat= await ChatModel.create(message)
     
 if (chat) {
  await new ChatCreatedPublisher(
    kafkaWrapper.producer as Producer 
  ).produce({
    _id:chat._id as string,
    content:chat.content as string,
    id: chat.id as unknown as string,
    recipientId:chat.recipientId as string,
    roomId:chat.roomId as  string,
    senderId:chat.senderId as string,
    senderName:chat.senderName as string,
    type: chat.type as unknown as string, 
  });
}
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

app.use('/', router);

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


