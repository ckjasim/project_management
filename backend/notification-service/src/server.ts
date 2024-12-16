import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cookieParser from 'cookie-parser';
import router from './infrastructure/routes/notificationRouter';
import dbConnect from './database/dbConnect';
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import {
  ChatCreateConsumer,
  EmployeeCreateConsumer,
  TaskCreateConsumer,
  TeamCreateConsumer,
  UserCreateConsumer,
} from './infrastructure/util/kafka/consumer/consumer';

import { config } from 'dotenv';
import container from './infrastructure/util/inversify';
import INTERFACE_TYPES from './infrastructure/constants/inversify';
import { ChatModel } from './database/model/chatModel';
import { notificationSockets } from './infrastructure/constants/socketStore';

config();
async function start() {
  try {
    dbConnect();
    await kafkaWrapper.connect();

    const UserConsumer = await kafkaWrapper.createConsumer(
      'user-created-for-notification'
    );
    const EmployeeConsumer = await kafkaWrapper.createConsumer(
      'employee-created-for-notification'
    );
    const TaskConsumer = await kafkaWrapper.createConsumer(
      'task-created-for-notification'
    );
    const ChatConsumer = await kafkaWrapper.createConsumer(
      'chat-created-for-notification'
    );
    const TeamConsumer = await kafkaWrapper.createConsumer(
      'team-created-for-notification'
    );

    await UserConsumer.connect();
    await EmployeeConsumer.connect();
    await TaskConsumer.connect();
    await ChatConsumer.connect();
    await TeamConsumer.connect();
    console.log('Consumer connected successfully');

    const listener = new UserCreateConsumer(UserConsumer);
    const listener2 = new EmployeeCreateConsumer(EmployeeConsumer);
    const listener3 = new TaskCreateConsumer(TaskConsumer);
    const listener4 = new ChatCreateConsumer(ChatConsumer);
    const listener5 = new TeamCreateConsumer
    
    
    (TeamConsumer);

    await listener.listen(); 
    await listener2.listen(); 
    await listener3.listen();
    await listener4.listen();
    await listener5.listen();
  } catch (error) {
    console.error('Error starting consumer:', error);
  }
}
start();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',router)

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});



io.on('connection', (socket: Socket) => {
  console.log('New user connected');
  const userId = socket.handshake.query.userId;
  console.log('User connected with ID:', userId);
  notificationSockets.set(userId as string, socket.id);

  console.log(notificationSockets)

  socket.on('disconnect', () => {
   
    notificationSockets.delete(userId as string);
    console.log(`User with ID ${userId} disconnected.`);
  });

});

app.use('/api', router);

const PORT = 3004;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
