import User from "../Models/UserModel.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request } from "../Models/RequestModel.js"

dotenv.config()

const generateJWT = async (_id,expiresIn) => {

    let userCredentials = await User.findOne({ _id });

    if (!userCredentials) {
       console.log("id not found in userdatabase");

       userCredentials = await Request.findOne({_id});

       if(!userCredentials)
       {
            console.log("id not found in request database");

            return undefined
       }
       
    }


    //generate JWT token
    const payload = {
        email: userCredentials.email,
        id: userCredentials._id,
        role: userCredentials.role,
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });

    return token
}

export { generateJWT }