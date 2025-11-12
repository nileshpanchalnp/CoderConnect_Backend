import { User } from "../models/user.js";
import Question from "../models/question.js";
import Answer from "../models/answer.js";
import QuestionComment from "../models/questionComment.js";
import AnswerComment from "../models/answerComment.js";

export const getUserProfileData = async (req, res) => {
  try {
    const user_id = req.user._id;

    // --- We can run all these database queries in parallel ---
    const [
      user,
      questionsCount,
      answersCount,
      questionCommentsCount,
      answerCommentsCount,
      userQuestions
    ] = await Promise.all([
      // Query 1: Get User
      User.findById(user_id).select("username display_name avatar_url reputation"),
      
      // Query 2: Get Question Count
      Question.countDocuments({ author_id: user_id }),
      
      // Query 3: Get Answer Count
      Answer.countDocuments({ author_id: user_id }),
      
      // Query 4 & 5: Get Comment Counts
      QuestionComment.countDocuments({ author_id: user_id }),
      AnswerComment.countDocuments({ author_id: user_id }),
      
      // --- Query 6: Get The User's Questions (THE NEW PART) ---
      Question.find({ author_id: user_id })
        .select("title description views createdAt") // Select only needed fields
        .sort({ createdAt: -1 }) // Sort by newest first
    ]);
    // --- End Parallel Queries ---


    const totalComments = questionCommentsCount + answerCommentsCount;

    res.json({
      user,
      stats: {
        // --- Keys updated to match frontend ---
        questionsAsked: questionsCount,
        answersPosted: answersCount,
        commentsPosted: totalComments,
      },
      // --- Send the questions array ---
      questions: userQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};