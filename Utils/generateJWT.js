import {User} from "../Models/UserModel.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request } from "../Models/RequestModel.js"

dotenv.config()

const generateJWT = async (userCredentials,expiresIn) => {

    if(!userCredentials)
    {
        return undefined
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