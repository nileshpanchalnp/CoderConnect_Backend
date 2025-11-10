import QuestionComment from "../models/questionComment.js";

export const createQuestionComment = async (req, res) => {
  try {
        const { question_id } = req.params;
    const {  content } = req.body;
    const author_id = req.user._id;

    if (!content ) {
      return res.status(400).json({ message: "Content  required" });
    }

    const comment = await QuestionComment.create({ content, author_id, question_id });
    res.status(201).json({ message: "Question comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuestionComments = async (req, res) => {
  try {
    const { question_id } = req.params;

    const comments = await QuestionComment.find({ question_id })
      .populate("author_id", "username display_name avatar_url reputation")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};