import Vote from "../models/vote.js";
import Question from "../models/question.js"

export const voteQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { vote_type } = req.body;
    const author_id = req.user._id;

    if (!["like", "dislike"].includes(vote_type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const existingVote = await Vote.findOne({ author_id, question_id });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // --- VOTE REMOVED ---
        await Vote.deleteOne({ _id: existingVote._id });

        // --- 2. ADD THIS ---
        // Decrement the count on the Question
        const updateField = vote_type === 'like' ? 'vote_likes' : 'vote_dislikes';
        await Question.findByIdAndUpdate(question_id, { $inc: { [updateField]: -1 } });
        // --- END ---

        return res.json({ message: "Vote removed" });
      } else {
        // --- VOTE SWAPPED ---
        existingVote.vote_type = vote_type;
        await existingVote.save();

        // --- 3. ADD THIS ---
        // Decrement old type, increment new type on the Question
        const incUpdate = vote_type === 'like'
          ? { vote_likes: 1, vote_dislikes: -1 }
          : { vote_likes: -1, vote_dislikes: 1 };
        await Question.findByIdAndUpdate(question_id, { $inc: incUpdate });
        // --- END ---

        return res.json({ message: "Vote updated", vote: existingVote });
      }
    }

    // --- NEW VOTE ADDED ---
    const newVote = await Vote.create({ author_id, question_id, vote_type });

    // --- 4. ADD THIS ---
    // Increment the count on the Question
    const updateField = vote_type === 'like' ? 'vote_likes' : 'vote_dislikes';
    await Question.findByIdAndUpdate(question_id, { $inc: { [updateField]: 1 } });
    // --- END ---

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