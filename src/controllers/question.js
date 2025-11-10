import Question from "../models/question.js";
import { User } from "../models/user.js";

// Create Question
export const createQuestion = async (req, res) => {
  try {
    const { title, description ,tags } = req.body;
     const author_id = req.user._id;

      if (!title || !description ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const question = await Question.create({ title, description, author_id,tags });
        // ✅ Increase reputation
    await User.findByIdAndUpdate(author_id, { $inc: { reputation: 5 } });

    res.json({ message: "Question created successfully", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author_id", "username display_name avatar_url reputation")
      .sort({ createdAt: -1 });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Question + Increase Views
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author_id", "username display_name avatar_url reputation")


    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const question = await Question.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json({ message: "Question updated", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
