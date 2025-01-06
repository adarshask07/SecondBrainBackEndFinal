import { User } from "../Models/User.model.js";
import { getEmbedding } from "../config/GetEmbeddings.js";
import { Content } from "../Models/Content.model.js";
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv' ;
import { main } from "../config/Llama.js";
dotenv.config() ;

export const signup =async (req,res) =>{
    const {username, password ,email} = req.body ;
    const isUserExist = await User.findOne({
        email : email 
    })

    if(isUserExist){
        return res.status(400).json({
            sucess : false ,
            message : "User already exist with this mail id"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10) ;
    console.log(hashedPassword)

    const newUser = new User ({
        username : username ,
        password :  hashedPassword,
        email : email 
    })
    const savedUser = await newUser.save() ;

    return res.status(200).json({
        success : true ,
        message : "User created sucessfully" ,
        
    })



}



export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login called");

    try {
        // Check if the user exists
        const isValidUser = await User.findOne({ email });
        console.log(isValidUser);

        if (!isValidUser) {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }

        // Compare the password (hashed in the database vs. entered password)
        const isPasswordCorrect = await bcrypt.compare(password, isValidUser.password);

        if (isPasswordCorrect) {
            const payload = {
                id: isValidUser._id
            };
            console.log(process.env.JWT_SECRET);

            // Create a JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set the cookie (with security options like httpOnly)
            res.cookie("token", token).status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }
    } catch (error) {
        console.error("Error during login:", error);  // Log the error
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




export const searchContent = async (req, res) => {
    // const { query } = req.body;/
    const query = "which is my favourite bike ?" ;
    const userId = req.user._id ;
  
    try {
      // Generate the embedding for the search query
      const queryEmbedding = await getEmbedding(query);

    //   console.log(queryEmbedding) ;
  
      // Define the aggregation pipeline for vector search 
      const pipeline = [
      
        {
            $vectorSearch: {
                index: "vector_search",
                queryVector: queryEmbedding,
                filter: {
                   
                       user: { $eq: userId } ,  // Filter for current user's content
                    
                    
                },
                path: "embeddings",
                exact: true,
                limit: 3
            }
        },
     
        {
            $project: {
                _id: 0,
                title : 1, 
                content: 1,
                score: {
                    $meta: "vectorSearchScore"
                },
                updatedAt: 1,
                createdAt :1
            }
        }
    ];

  
      // Run the query on your Content collection
      const results = await Content.aggregate(pipeline).exec();

      const prompt = {
        query : query ,
        brain : results
      }
  
      const answer = await main(prompt)
      return res.status(200).json({
        success: true,
        message: "Search results retrieved successfully",
        data: answer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error executing vector search",
        error: error.message,
      });
    }
  };
  