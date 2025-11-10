import Vote from "../models/vote.js";

export const voteQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { vote_type } = req.body;
    const author_id = req.user._id;

    if (!["like", "dislike"].includes(vote_type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    // Check if a vote already exists
    const existingVote = await Vote.findOne({ author_id, question_id });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        await Vote.deleteOne({ _id: existingVote._id });
        return res.json({ message: "Vote removed" });
      } else {
        existingVote.vote_type = vote_type;
        await existingVote.save();
        return res.json({ message: "Vote updated", vote: existingVote });
      }
    }

    // Create a new vote
    const newVote = await Vote.create({ author_id, question_id, vote_type });
    res.status(201).json({ message: "Vote added", vote: newVote });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const voteAnswer = async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { vote_type } = req.body;
    const author_id = req.user._id;

    if (!["like", "dislike"].includes(vote_type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const existingVote = await Vote.findOne({ author_id, answer_id });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        await Vote.deleteOne({ _id: existingVote._id });
        return res.json({ message: "Vote removed" });
      } else {
        existingVote.vote_type = vote_type;
        await existingVote.save();
        return res.json({ message: "Vote updated", vote: existingVote });
      }
    }

    const newVote = await Vote.create({ author_id, answer_id, vote_type });
    res.status(201).json({ message: "Vote added", vote: newVote });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};