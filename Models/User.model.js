import { Schema, model } from 'mongoose';


const userSchema = new Schema({
    username :{
        type :String ,
        required :true,
    },
    email :{
        type :String ,
        required :true,
    },
    password :{
        type :String ,
        required :true,
    },
    brain : [{
        type : Schema.Types.ObjectId,
        ref : "Content"
    }]

    
})

export const User = model('User', userSchema);
