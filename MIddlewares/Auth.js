import jwt from 'jsonwebtoken' ;
import dotenv from 'dotenv'
import { User } from '../Models/User.model.js';

dotenv.config()



export const auth = async (req, res, next)=>{
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    // console.log(token)
    if(!token){
        return res.status(400).json({
            sucess : false ,
            message : "You are not authorized to view this page"
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET) ;
    if(!decode){
        return res.status(400).json({
            sucess : false ,
            message : "Invalid Token. You are not authorized to view this page"
        })
    }
    const userId = decode.id ;
    // console.log(userId)
    const user = await User.findOne({_id: userId}) ;
    
    req.user = user  ;
    // console.log(user) ;
    next() ;

}