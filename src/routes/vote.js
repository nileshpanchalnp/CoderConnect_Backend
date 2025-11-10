import express from "express";
import {auth} from "../middleware/auth.js";
import { voteQuestion, voteAnswer } from "../controllers/vote.js";

const vote_router = express.Router();

// Vote question
vote_router.post("/question/:question_id", auth, voteQuestion);
// Vote answer
vote_router.post("/answer/:answer_id", auth, voteAnswer);

export default vote_router;