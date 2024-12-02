import express, { urlencoded } from 'express';
import "reflect-metadata";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import dbConnect from './database/dbConnect';
import router from './infrastructure/routes/authRoute';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';

config();
dbConnect();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  
}));

app.use(cookieParser());

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));




app.use('/api', router);


app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000 at http://localhost:3000');
});
