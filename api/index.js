import express from 'express'
import dotenv from 'dotenv' 
import mongoose from 'mongoose'
import cors from 'cors'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import hotelsRoute from './routes/hotels.js'
import roomsRoute from './routes/rooms.js'
import keyRoute from './routes/key.js'
import KkeyRoute from './routes/Kkeys.js'

const app = express()
dotenv.config()


const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongo DB")
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDB disconnected")
})

//middlewares

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoute); 
app.use("/api/users", usersRoute); 
app.use("/api/hotels", hotelsRoute); 
app.use("/api/rooms", roomsRoute);
app.use("/api/Kkeys", KkeyRoute);
app.use("/api/keys", keyRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });

app.listen(8890, ()=>{
    connect()
    console.log("connect to backend!")
})