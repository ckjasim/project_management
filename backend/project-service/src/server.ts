import express, { urlencoded } from 'express';
import "reflect-metadata"
import cors from 'cors'


import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/projectRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser'

config()
dbConnect();

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
  console.log('Listening to port 3001 http://localhost:3002')
}) 