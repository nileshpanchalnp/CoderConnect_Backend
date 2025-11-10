import AnswerComment from "../models/answerComment.js";

export const createAnswerComment = async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { content } = req.body;
    const author_id = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content  required" });
    }

    const comment = await AnswerComment.create({ content, author_id, answer_id });
    res.status(201).json({ message: "Answer comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnswerComments = async (req, res) => {
  try {
    const { answer_id } = req.params;

    const comments = await AnswerComment.find({ answer_id })
      .populate("author_id", "username display_name avatar_url reputation")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
