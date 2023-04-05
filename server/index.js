import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/user/auth.js";
import userRoutes from "./routes/user/users.js";
import postRoutes from "./routes/user/posts.js"
import chatRoutes from "./routes/user/chat.js"
import messageRoutes from "./routes/user/message.js"

import adminAuthRoutes from "./routes/admin/auth.js";
import usersManageRoutes from "./routes/admin/users.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });

app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use(cors({
    origin: ["https://master.d2e6svn9b4d3ox.amplifyapp.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
  );  
app.use('/images', express.static(path.join(__dirname, 'public')));

//userRoutes
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/socket/chat", chatRoutes)
app.use("/socket/message", messageRoutes);


app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin", usersManageRoutes)

//mongoose
const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useNewURlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server Port: ${PORT}`)
    }) 
}).catch((error)=>{
    console.log(`${error} did not connect`);
})

