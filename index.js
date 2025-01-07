import express, { json } from 'express';
import {dbConnection} from './config/db.js'
import UserRoutes  from './Routes/UserRoutes.js'
import cookieParser from 'cookie-parser';
import ContentRoutes from './Routes/ContentRoutes.js'
import cors from 'cors' ;


const app = express();
app.use(json());
app.use(cookieParser())
app.use(cors())

// Connect to the database
dbConnection();

app.use('/auth', UserRoutes) ;
app.use('/memories', ContentRoutes)

app.get("/", (req,res)=>{
	return res.send("Hello")
})


// Start the server
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
