import express, { urlencoded } from 'express';
import "reflect-metadata";
import cors from 'cors';
import { config } from "dotenv";
import dbConnect from './database/dbConnect';
import router from './infrastructure/routes/projectRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http'; 
import IChatController from './infrastructure/interfaces/IChatController';
import container from './infrastructure/util/inversify';
import INTERFACE_TYPES from './infrastructure/constants/inversify';

config();
dbConnect();

const app = express();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.use(errorHandler);

const chatController = container.get<IChatController>(INTERFACE_TYPES.ChatController);

io.on('connection', (socket) => {
  chatController.initializeSocket(io, socket, () => {});
});


server.listen(3003, () => {
  console.log('Listening on port 3003 http://localhost:3003');
});