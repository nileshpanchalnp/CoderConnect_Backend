import express from "express";
import {auth} from "../middleware/auth.js"
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  // incrementQuestionViews 
} from "../controllers/question.js";

const question_router = express.Router();

question_router.post("/create",auth, createQuestion); // create
question_router.get("/getall", getQuestions); // get all
question_router.get("/get/:id", getQuestionById); // get single
question_router.put("/update/:id", updateQuestion); // update
question_router.delete("/delete/:id", deleteQuestion); // delete
// question_router.patch("/questions/:_id/views", incrementQuestionViews);

export default question_router;
