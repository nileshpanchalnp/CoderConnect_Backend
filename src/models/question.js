import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    tags: [{ type: String, default: [] }],
    answer_count: { type: Number, default: 0 }, 
    vote_likes: { type: Number, default: 0 },
    vote_dislikes: { type: Number, default: 0 }
  },
  { timestamps: true } 
);

export default mongoose.model("Question", questionSchema);