import express, { urlencoded } from 'express';
import "reflect-metadata"
import cors from 'cors'


import {config} from "dotenv"
import dbConnect from './database/dbConnect'
import router from './infrastructure/routes/taskRouter';
import { errorHandler } from './infrastructure/middleware/errorMiddleware';

config()
dbConnect();

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',router)

app.use(errorHandler)


app.listen(3001,()=>{
  console.log('Listening to port 3001 http://localhost:3001')
}) 