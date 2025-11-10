import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question", default: null },
    answer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", default: null },
    vote_type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vote", voteSchema);