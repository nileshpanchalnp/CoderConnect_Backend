import mongoose from "mongoose" ;

const answerSchema = new mongoose.Schema({
    question_id:{type:mongoose.Schema.Types.ObjectId, ref:"Question",required:true},
    author_id:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    content  : {type:String,required:true}
},
    {timestamps:true}
)
export default mongoose.model("Answer",answerSchema)