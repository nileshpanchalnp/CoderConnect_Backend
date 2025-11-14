import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import user_router from "./routes/user.js"
import question_router from "./routes/question.js"
import answer_router from "./routes/answer.js"
import QuestionComment_router from "./routes/questionComment.js";
import answerComment_router from "./routes/answerComment.js"
import vote_router from "./routes/vote.js"
import profile_router from "./routes/profile.js"

dotenv.config();

const app = express()

// ✅ ALSO IMPORTANT IF YOU USE COOKIES
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173',"https://coder-connect.vercel.app/"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/User", user_router);
app.use("/Question",question_router)
app.use("/Answer",answer_router)
app.use("/CommentQuestion",QuestionComment_router)
app.use("/CommnetAnswer",answerComment_router)
app.use("/Vote",vote_router)
app.use("/Profile",profile_router)

app.listen(process.env.PORT, ()=>{
    mongoose.connect(process.env.MONGO_URl)
    console.log("Port run is",process.env.PORT)
    console.log("mongodb url is",process.env.MONGO_URl)
})
