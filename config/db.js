import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config() ;
const url = process.env.MONGODB_URL;

export const dbConnection = async () => {
	try {
		await mongoose.connect(url);
		console.log("DB Connection Success");
	} catch (err) {
		console.error("DB Connection Failed");
		console.error(err);
		process.exit(1); // Exit the application if DB connection fails
	}
};
