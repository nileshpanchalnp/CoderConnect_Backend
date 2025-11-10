import mongoose from "mongoose";

const questionCommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QuestionComment", questionCommentSchema);