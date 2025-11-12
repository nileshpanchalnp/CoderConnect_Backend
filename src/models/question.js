import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    tags: [{ type: String, default: [] }],
    // --- ADD THESE THREE LINES ---
    // For Requirement 2: Total answer count
    answer_count: { type: Number, default: 0 }, 
    // For Requirement 1: Total question votes
    vote_likes: { type: Number, default: 0 },
    vote_dislikes: { type: Number, default: 0 }
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

export default mongoose.model("Question", questionSchema);