import { User } from "../Models/User.model.js";
import { getEmbedding } from "../config/GetEmbeddings.js";
import { Content } from "../Models/Content.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { main } from "../config/Llama.js";
dotenv.config();
import mongoose from "mongoose";
import { preinfoSearch } from "../config/prompts.js";

const { ObjectId } = mongoose.Types;

export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  const isUserExist = await User.findOne({
    email: email,
  });

  if (isUserExist) {
    return res.status(400).json({
      sucess: false,
      message: "User already exist with this mail id",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  //

  const newUser = new User({
    username: username,
    password: hashedPassword,
    email: email,
  });
  const savedUser = await newUser.save();

  return res.status(200).json({
    success: true,
    message: "User created sucessfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const isValidUser = await User.findOne({ email });

    if (!isValidUser) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    // Compare the password (hashed in the database vs. entered password)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isValidUser.password
    );

    if (isPasswordCorrect) {
      const payload = {
        _id: isValidUser._id,
      };

      // Create a JWT token
      // const token = jwt.sign(payload, process.env.JWT_SECRET,{
      //   expiresIn: "1h",
      // });
      const token = jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn: '30d' });

      const userInfo = {
        username : isValidUser.username,

      }
      // Set the cookie (with security options like httpOnly)
      res.cookie("token", token).status(200).json({
        success: true,
        message: "User logged in successfully",
        token: token,
        user: userInfo,
      });

    } else {
        return res.status(401).json({
          success: false,
          message: "Email or password is incorrect",
        });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const searchContent = async (req, res) => {
  const { query } = req.body;
  // console.log(req.user._id);
  
  // const query = "which bike do i have ?" ;
  const userId = new mongoose.Types.ObjectId(String(req.user._id)); // Correctly reference _id

  try {
    // Generate the embedding for the search query
    const queryEmbedding = await getEmbedding(query);

    //   console.log(queryEmbedding) ;

    // Define the aggregation pipeline for vector search
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_search", // Your vector search index
          queryVector: queryEmbedding, // Query vector generated from embeddings
          filter: {
            user: new ObjectId(userId), // Use the $eq operator for equality check
          },
          path: "embeddings", // The path to the embeddings field in your documents
          exact: true,
          limit: 3, // Limit the results
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          tags: 1,
          score: {
            $meta: "vectorSearchScore",
          },
          updatedAt: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          score: -1, // Sort by score in descending order (highest score first)
        },
      },
    ];

    // Run the query on your Content collection
    const results = await Content.aggregate(pipeline).exec();

    const sortedResults = results.sort((a, b) => {
      if (a.score && b.score) {
        return b.score - a.score;
      }
      return 0; // No sorting if score is missing or invalid
    });

    const prompt = {
      query: query,
      brain: results,
      preInfo : preinfoSearch
    };

    const answer = await main(prompt);
    return res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      data: answer,
      relatedData: sortedResults,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error executing vector search",
      error: error.message,
    });
  }
};
