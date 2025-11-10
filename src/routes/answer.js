import express from "express"
import { createAnswer, getAnswersByQuestion } from "../controllers/answer.js";
import { auth } from "../middleware/auth.js"; // ✅ Add this

const answer_router = express.Router();

answer_router.post("/create/:question_id",auth,createAnswer);
answer_router.get("/get/:question_id",getAnswersByQuestion)

export default answer_router;