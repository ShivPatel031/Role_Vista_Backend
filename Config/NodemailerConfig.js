import nodemailer from "nodemailer";

// Create object to send mails
const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        } 
    }
);

export {transport};