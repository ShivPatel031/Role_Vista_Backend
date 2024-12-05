import {transport} from "../Config/NodemailerConfig.js"
import dotenv from "dotenv";
dotenv.config();

// mail verification function
const sendMail = async (to_email,subject,message)=>
{
      transport.sendMail({
        from: process.env.EMAIL_FROM, 
        to: to_email, 
        subject:subject, 
        html:message,
      },(error)=>{if(error) console.log(error)});
}

export {sendMail};