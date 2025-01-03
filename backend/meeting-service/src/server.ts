import express, { urlencoded } from 'express';
import "reflect-metadata";
import cors from 'cors';
import { config } from "dotenv";
import dbConnect from './database/dbConnect';
import router from './infrastructure/routes/router';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import kafkaWrapper from './infrastructure/util/kafka/kafkaWrapper';
import { 
  EmployeeCreateConsumer, 
  EmployeeUpdatedConsumer, 
  TeamCreateConsumer, 
  UserUpdatedConsumer 
} from './infrastructure/util/kafka/consumer/consumer';

config();

async function start() {
  try {
    dbConnect();
    await kafkaWrapper.connect();

    const UserConsumer = await kafkaWrapper.createConsumer('user-created-for-task');
    const UserUpdateConsumer = await kafkaWrapper.createConsumer('user-updated-for-task');
    const EmployeeUpdateConsumer = await kafkaWrapper.createConsumer('employee-updated-for-task');
    const TeamConsumer = await kafkaWrapper.createConsumer('team-created-for-task');
    const EmployeeConsumer = await kafkaWrapper.createConsumer('employee-created-for-task');
    
    await TeamConsumer.connect();
    await EmployeeConsumer.connect();
    await UserConsumer.connect();
    await EmployeeUpdateConsumer.connect();
    await UserUpdateConsumer.connect();
    console.log("Consumer connected successfully");

    const listener1 = new UserUpdatedConsumer(UserUpdateConsumer);
    const listener2 = new EmployeeUpdatedConsumer(EmployeeUpdateConsumer);
    const listener3 = new TeamCreateConsumer(TeamConsumer);
    const listener5 = new EmployeeCreateConsumer(EmployeeConsumer);

    await listener1.listen(); 
    await listener2.listen(); 
    await listener3.listen(); 
    await listener5.listen(); 
  } catch (error) {
    console.error("Error starting consumer:", error);
  }
}
start();

const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    express.raw({ type: 'application/json' })(req, res, next); // Parse raw body for webhook
  } else {
    express.json()(req, res, next); // Use JSON parser for other routes
  }
});

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  
}));
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(errorHandler);

app.listen(3005, () => {
  console.log('Listening to port 3005 http://localhost:3005');
});
