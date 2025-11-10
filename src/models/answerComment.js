import mongoose from "mongoose";

const answerCommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AnswerComment", answerCommentSchema);