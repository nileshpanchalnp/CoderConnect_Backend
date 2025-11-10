import express from "express";
import { createQuestionComment, getQuestionComments } from "../controllers/questionComment.js";
import { auth } from "../middleware/auth.js";

const QuestionComment_router = express.Router();

QuestionComment_router.post("/create/:question_id", auth, createQuestionComment);
QuestionComment_router.get("/get/:question_id", getQuestionComments);

export default QuestionComment_router;
