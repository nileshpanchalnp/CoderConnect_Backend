import express from "express";
import {auth} from "../middleware/auth.js"
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.js";

const question_router = express.Router();

question_router.post("/create",auth, createQuestion); // create
question_router.get("/getall", getQuestions); // get all
question_router.get("/get/:id", getQuestionById); // get single
question_router.put("/update/:id", updateQuestion); // update
question_router.delete("/delete/:id", deleteQuestion); // delete

export default question_router;
