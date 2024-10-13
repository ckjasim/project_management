import express, { urlencoded } from 'express';
import "reflect-metadata"
import session from "express-session"



import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/authRoute';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';

config()
dbConnect();

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',router)

app.use(errorHandler)
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false
}));

app.listen(3000,()=>{
  console.log('Listening to port 3000 http://localhost:3000')
}) 