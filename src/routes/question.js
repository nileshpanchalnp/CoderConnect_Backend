import express from "express";
import {auth,optionalAuth} from "../middleware/auth.js"
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
getAllTags
} from "../controllers/question.js";

const question_router = express.Router();

question_router.post("/create",auth, createQuestion); 
question_router.get("/getall", getQuestions);
question_router.get("/get/:id",optionalAuth, getQuestionById); 
question_router.put("/update/:id", updateQuestion);
question_router.delete("/delete/:id", deleteQuestion); 
question_router.get("/tags", getAllTags);

export default question_router;
