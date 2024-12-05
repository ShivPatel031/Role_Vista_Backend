import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./Config/DatabaseConnection.js";


// Config .env file
dotenv.config();

const port = process.env.PORT || 8000;

// Connecting to database
connectDatabase();

// start server on port
app.listen(port, () => {
    console.log("Server is running on port : ", port);
})



