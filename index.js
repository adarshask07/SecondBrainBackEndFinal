import express, { json } from 'express';
import {dbConnection} from './config/db.js'
import UserRoutes  from './Routes/UserRoutes.js'
import cookieParser from 'cookie-parser';
import ContentRoutes from './Routes/ContentRoutes.js'
import cors from 'cors' ;
import dotenv from 'dotenv'


const app = express();

app.use(json());
app.use(cookieParser())
app.use(cors({
  origin: '*', // or use '*' to allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // specify allowed headers
}));

// Handle preflight requests for all routes
app.options('*', cors());
dbConnection();
dotenv.config()

app.use('/auth', UserRoutes) ;
app.use('/memories', ContentRoutes)

// Connect to the database


app.get("/", (req,res)=>{
	return res.send("Hello")
})


// Start the server
app.listen(process.env.PORT_NO, () => {
	console.log(`Server is running on port ${process.env.PORT_NO}`);
});
