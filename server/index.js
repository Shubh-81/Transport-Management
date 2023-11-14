import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import {register} from './controllers/auth.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import busRoutes from './routes/bus.js';
import requestRoutes from './routes/request.js';
import announcementRoutes from './routes/announcement.js';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

dotenv.config();
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new SocketIO(server, {
    cors: {
        origin: "http://localhost:3000", // Set this to your client's URL
        methods: ["GET", "POST"]
    }
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());


app.post('/auth/register',register);
app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/bus',busRoutes);
app.use('/request',requestRoutes);
app.use('/announcement',announcementRoutes);

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});


const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        server.listen(PORT,()=>{console.log(`Sever Port : ${PORT}`)});
    })
    .catch((err)=>{console.log(`${err} : Error Occurred`)});

export default io;





