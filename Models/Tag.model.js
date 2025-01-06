import mongoose from "mongoose" 


const tagSchema = new mongoose.Schema({
    name :{
        type :String ,
        required :true,
    },
    content : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Content"
    }],
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

export const Tag = mongoose.model('Tag', tagSchema);