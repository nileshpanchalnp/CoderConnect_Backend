import Question from "../models/question.js";
import { User } from "../models/user.js";
import Answer from "../models/answer.js";
import QuestionComment from "../models/questionComment.js";
import AnswerComment from "../models/answerComment.js";
import Vote from "../models/vote.js"; 

// Create Question
export const createQuestion = async (req, res) => {
  try {
    const { title, description ,tags } = req.body;
     const author_id = req.user._id;

      if (!title || !description ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const question = await Question.create({ title, description, author_id,tags });
        // Increase reputation
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

    const formattedQuestions = questions.map(question => {
      const q = question.toObject(); 
      return {
        ...q,
        // Transform the array of strings into an array of objects
        tags: q.tags.map(tagName => ({ name: tagName })) 
      };
    });
    // --- END FIX ---
    res.json({ questions: formattedQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Example of how you would modify the backend (server.js)
// export const getQuestionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // CRITICAL: Get the authenticated user's ID from middleware
//     const currentUserId = req.user?._id; 

//     // --- 1. Fetch Question and Prepare for Vote Aggregation ---
//     const questionDoc = await Question.findByIdAndUpdate(
//       id,
//       { $inc: { views: 1 } },
//       { new: true }
//     ).populate("author_id", "username display_name avatar_url reputation")
    
//     if (!questionDoc) return res.status(404).json({ message: "Question not found" });

//     // Convert to plain object to easily add vote properties
//     let question = questionDoc.toObject();

//     // --- 2. Fetch Answers and Vote Data in Parallel ---
//     // Get all Answers for this Question
//     const rawAnswers = await Answer.find({ question_id: id })
//       .populate("author_id", "username display_name avatar_url reputation")
//       .sort({ createdAt: -1 });

//     // Get the IDs of all answers to query votes efficiently
//     const answerIds = rawAnswers.map(ans => ans._id);
    
//     // Fetch ALL votes related to this question (both on question and on answers)
//     const allVotes = await Vote.find({
//         $or: [
//             { question_id: id },
//             { answer_id: { $in: answerIds } }
//         ]
//     });

//     // --- 3. Process Question Votes ---
//     const questionVotes = allVotes.filter(v => v.question_id && v.question_id.equals(id));
    
//     question.vote_likes = questionVotes.filter(v => v.vote_type === 'like').length;
//     question.vote_dislikes = questionVotes.filter(v => v.vote_type === 'dislike').length;
//     question.user_vote = null;

//     if (currentUserId) {
//         const userVoted = questionVotes.find(v => v.author_id.equals(currentUserId));
//         if (userVoted) {
//             question.user_vote = userVoted.vote_type; 
//         }
//     }

//     // --- 4. Process Answer Votes ---
//     const answersWithVotes = rawAnswers.map(answerDoc => {
//         let answer = answerDoc.toObject();
//         const answerId = answer._id;

//         const answerVotes = allVotes.filter(v => v.answer_id && v.answer_id.equals(answerId));

//         // Calculate total likes and dislikes for the answer
//         answer.vote_likes = answerVotes.filter(v => v.vote_type === 'like').length;
//         answer.vote_dislikes = answerVotes.filter(v => v.vote_type === 'dislike').length;
//         answer.user_vote = null;

//         // Determine the current user's vote on the answer
//         if (currentUserId) {
//             const userVoted = answerVotes.find(v => v.author_id.equals(currentUserId));
//             if (userVoted) {
//                 answer.user_vote = userVoted.vote_type;
//             }
//         }
//         return answer;
//     });

//     // --- 5. Respond with the enriched data ---
//     res.json({ 
//         question, 
//         answers: answersWithVotes, 
//     });
//   } catch (error) {
//     console.error("Error in getQuestionById:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// Ensure Question and Answer models are also imported

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id;

    const questionDoc = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author_id", "username display_name avatar_url reputation");

    if (!questionDoc)
      return res.status(404).json({ message: "Question not found" });

    let question = questionDoc.toObject();

    // Format tags
    if (question.tags && Array.isArray(question.tags)) {
      question.tags = question.tags.map((tag) => ({ name: tag }));
    }

    // 1️⃣ Question votes
    const questionVotes = await Vote.find({ question_id: id });
    question.vote_likes = questionVotes.filter(v => v.vote_type === "like").length;
    question.vote_dislikes = questionVotes.filter(v => v.vote_type === "dislike").length;
    question.user_vote = null;

    if (currentUserId) {
      const userVoted = questionVotes.find(v => v.author_id.equals(currentUserId));
      if (userVoted) question.user_vote = userVoted.vote_type;
    }

    // 2️⃣ Question comments
    const questionComments = await QuestionComment.find({ question_id: id })
      .populate("author_id", "username display_name avatar_url reputation")
      .sort({ createdAt: 1 });

    // 3️⃣ Answers, votes, and comments
    const rawAnswers = await Answer.find({ question_id: id })
      .populate("author_id", "username display_name avatar_url reputation")
      .sort({ createdAt: -1 });

    const answerIds = rawAnswers.map(a => a._id);

    const [allAnswerVotes, allAnswerComments] = await Promise.all([
      Vote.find({ answer_id: { $in: answerIds } }),
      AnswerComment.find({ answer_id: { $in: answerIds } })
        .populate("author_id", "username display_name avatar_url reputation")
        .sort({ createdAt: 1 })
    ]);

    const answersWithDetails = rawAnswers.map(ansDoc => {
      const answer = ansDoc.toObject();
      const answerVotes = allAnswerVotes.filter(v => v.answer_id.equals(answer._id));
      answer.vote_likes = answerVotes.filter(v => v.vote_type === "like").length;
      answer.vote_dislikes = answerVotes.filter(v => v.vote_type === "dislike").length;

      answer.user_vote = null;
      if (currentUserId) {
        const userVoted = answerVotes.find(v => v.author_id.equals(currentUserId));
        if (userVoted) answer.user_vote = userVoted.vote_type;
      }

      answer.comments = allAnswerComments.filter(c => c.answer_id.equals(answer._id));
      return answer;
    });

    res.json({
      question,
      questionComments,
      answers: answersWithDetails,
    });
  } catch (error) {
    console.error("Error in getQuestionById:", error);
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

/**
 * @desc    Get all unique tags with their question counts
 * @route   GET /api/tags
 * @access  Public
 */
export const getAllTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      // 1. Deconstruct the "tags" array from each document
      { $unwind: "$tags" },
      
      // 2. Group documents by the tag name and count occurrences
      { $group: { 
          _id: "$tags", 
          question_count: { $sum: 1 } 
        } 
      },
      
      // 3. Rename "_id" to "name" for easier frontend use
      { $project: { 
          _id: 0, 
          name: "$_id", 
          question_count: "$question_count" 
        } 
      },
      
      // 4. Sort by tag name alphabetically
      { $sort: { name: 1 } }
    ]);

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Error fetching tags" });
  }
};