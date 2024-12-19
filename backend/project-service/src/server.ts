
import express, { urlencoded } from 'express';
import "reflect-metadata"
import cors from 'cors'

import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/projectRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser'
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { EmployeeCreateConsumer, EmployeeUpdatedConsumer, UserCreateConsumer, UserUpdatedConsumer } from './infrastructure/util/kafka/consumer/consumer';

config()
async function start() {
  try {
  
    dbConnect();
    await kafkaWrapper.connect();

    const consumer = await kafkaWrapper.createConsumer('user-created-for-project');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created-for-project');
    const UserUpdateConsumer = await kafkaWrapper.createConsumer('user-updated-for-project');
    const EmployeeUpdateConsumer = await kafkaWrapper.createConsumer('employee-updated-for-project');
    
    await consumer.connect();
    await EmployeeConsumer.connect();
    await UserUpdateConsumer.connect();
    await EmployeeUpdateConsumer.connect();
    console.log("Consumer connected successfully");

    

    const listener1= new UserUpdatedConsumer(UserUpdateConsumer);
    const listener2= new EmployeeUpdatedConsumer(EmployeeUpdateConsumer);
    const listener3= new UserCreateConsumer(consumer);
    const listener4= new EmployeeCreateConsumer(EmployeeConsumer);

    await listener1.listen(); 
    await listener2.listen(); 
    await listener3.listen(); 
    await listener4.listen(); 
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
app.use('/',router)

app.use(errorHandler)


app.listen(3002,()=>{
  console.log('Listening to port prj-s 3002 http://localhost:3002')
}) 
