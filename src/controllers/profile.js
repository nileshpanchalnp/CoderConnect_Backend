import {User} from "../models/user.js";
import Question from "../models/question.js";
import Answer from "../models/answer.js";
import QuestionComment from "../models/questionComment.js";
import AnswerComment from "../models/answerComment.js";

export const getUserProfileData = async (req, res) => {
  try {
    const user_id = req.user._id;

    const user = await User.findById(user_id).select("username display_name avatar_url reputation");

    const questionsCount = await Question.countDocuments({ author_id: user_id });
    const answersCount = await Answer.countDocuments({ author_id: user_id });

    const commentsCount =
      (await QuestionComment.countDocuments({ author_id: user_id })) +
      (await AnswerComment.countDocuments({ author_id: user_id }));

    res.json({
      user,
      stats: {
        questions: questionsCount,
        answers: answersCount,
        comments: commentsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
