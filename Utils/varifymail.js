import {transport} from "../Config/NodemailerConfig.js"
import dotenv from "dotenv";
dotenv.config();

// mail verification function
const sendMail = async (to_email,subject,message)=>
{
    const info = await transport.sendMail({
        from: `${process.env.EMAIL_FROM}`, 
        to: `${to_email}`, 
        subject, 
        html:message,
      });
}

export {sendMail};