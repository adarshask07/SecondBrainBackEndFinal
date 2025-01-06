import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
    
    title :{
        type :String ,
        required : true 
    },
    content :{
        type :String ,
        required : true 
    },
    tags :{
       type : [String],
       default : []
    },
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }, 
    embeddings: {
        type: [Number], 
        default: []
    }




}, {timestamps : true})


export const Content = mongoose.model('Content', contentSchema);