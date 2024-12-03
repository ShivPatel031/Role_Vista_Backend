import User from "../Models/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const generateJWT = async (_id) => {

    let userCredentials = await User.findOne({ _id })
    if (!userCredentials) {
        return {
            success: false,
            message: "id not found."
        }
    }


    //generate JWT token
    const payload = {
        email: userCredentials.email,
        id: userCredentials._id,
        role: userCredentials.role,
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    return token
}

export { generateJWT }