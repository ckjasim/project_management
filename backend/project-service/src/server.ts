
import express, { urlencoded } from 'express';
import "reflect-metadata"
import cors from 'cors'

import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/projectRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser'
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { EmployeeCreateConsumer, UserCreateConsumer } from './infrastructure/util/kafka/consumer/consumer';

config()
async function start() {
  try {
    // Ensure database and Kafka connections
    dbConnect();
    await kafkaWrapper.connect();

    // Create and connect consumer
    const consumer = await kafkaWrapper.createConsumer('user-created-for-project');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created-for-project');
    await consumer.connect();
    await EmployeeConsumer.connect();
    console.log("Consumer connected successfully");

    // Instantiate listener and subscribe to the topic
    const listener = new UserCreateConsumer(consumer);
    const listener2 = new EmployeeCreateConsumer(EmployeeConsumer);

    await listener.listen(); // Start listening to messages
    await listener2.listen(); // Start listening to messages
  } catch (error) {
    console.error("Error starting consumer:", error);
  }
}
start();

const app = express()

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',router)

app.use(errorHandler)


app.listen(3002,()=>{
  console.log('Listening to port prj-s 3002 http://localhost:3002')
}) 
