import {transport} from "../Config/NodemailerConfig.js"
import dotenv from "dotenv";
import { mailVerificationMessage } from "../constant.js";
dotenv.config();

// mail verification function
const sendVarificationMail = async (to_email,userName,verificationLink)=>
{
    const info = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM}`, 
        to: `${to_email}`, 
        subject: "Mail Varifiction for RoleVista.", 
        html:mailVerificationMessage.replace('{{userName}}', userName).replace('{{verificationLink}}', verificationLink),
      });
}

export {sendVarificationMail};