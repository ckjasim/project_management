import express, { urlencoded } from 'express';
import "reflect-metadata"
import cors from 'cors'


import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/taskRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser'
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { EmployeeCreateConsumer, ProjectCreateConsumer, TeamCreateConsumer } from './infrastructure/util/kafka/consumer/consumer';

config()
async function start() {
  try {
    
    dbConnect();
    await kafkaWrapper.connect();


    const ProjectConsumer = await kafkaWrapper.createConsumer('project-created');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created');
    const TeamConsumer = await kafkaWrapper.createConsumer('team-created');
    await ProjectConsumer.connect();
    await EmployeeConsumer.connect();
    await TeamConsumer.connect();
    console.log("Consumer connected successfully");

    const listener = new ProjectCreateConsumer(ProjectConsumer);
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


app.listen(3001,()=>{
  console.log('Listening to port 3001 http://localhost:3001')
}) 