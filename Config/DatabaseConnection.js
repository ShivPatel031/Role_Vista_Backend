import mongoose from "mongoose";

// functionn to connect database
const connectDatabase = async ()=>
{
    try {

        const connectedHost = await mongoose.connect(`${process.env.DATABASE_URL}`);

        console.log(`Database is connected successfully to host ${connectedHost.connection.host}.`);
        
    } catch (error) 
    {
        console.log("Something went wrong while connecting database.");
        console.log("Giving this error : ",error.message);
    }
}

export {connectDatabase};