import Answer from "../models/answer.js";
import { User } from "../models/user.js";
import Question from "../models/question.js";

export const createAnswer = async (req, res) => {
  try {
    const { question_id } = req.params;
    const {  content } = req.body;
    const author_id = req.user._id; // ✅ automatically from token

    if ( !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const answer = await Answer.create({
      question_id,
      author_id : author_id,
      content
    });
    // ✅ Increase reputation
    await User.findByIdAndUpdate(author_id, { $inc: { reputation: 2 } });
    // Increment the answer_count on the parent Question
    await Question.findByIdAndUpdate(question_id, { $inc: { answer_count: 1 } });
    // --- END ---
    res.status(201).json({ message: "Answer posted successfully", answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnswersByQuestion = async (req,res) => {
    try{
        const {question_id} = req.params;

        const answers = await Answer.find({ question_id: question_id })
      .populate("author_id", "username display_name avatar_url reputation") // get profile data
      .populate("question_id", "_id title")
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};