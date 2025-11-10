import express from "express";
import { createAnswerComment, getAnswerComments } from "../controllers/answerComment.js";
import { auth } from "../middleware/auth.js";

const answerComment_router = express.Router();

answerComment_router.post("/create/:answer_id", auth, createAnswerComment);
answerComment_router.get("/get/:answer_id", getAnswerComments);

export default answerComment_router;
