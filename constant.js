const mailVerificationMessage =  `<!DOCTYPE html>
                                    <html>
                                    <head>
                                    <style>
                                        body {
                                        font-family: Arial, sans-serif;
                                        margin: 0;
                                        padding: 0;
                                        background-color: #f4f4f9;
                                        }
                                        .email-container {
                                        max-width: 600px;
                                        margin: 20px auto;
                                        background-color: #ffffff;
                                        border: 1px solid #dddddd;
                                        border-radius: 8px;
                                        padding: 20px;
                                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                                        }
                                        .header {
                                        text-align: center;
                                        padding: 10px 0;
                                        background-color: #4caf50;
                                        color: white;
                                        border-radius: 8px 8px 0 0;
                                        }
                                        .header h1 {
                                        margin: 0;
                                        font-size: 24px;
                                        }
                                        .content {
                                        padding: 20px;
                                        color: #333333;
                                        line-height: 1.6;
                                        }
                                        .content p {
                                        margin: 0 0 10px;
                                        }
                                        .verify-button {
                                        display: block;
                                        width: 200px;
                                        margin: 20px auto;
                                        padding: 10px 20px;
                                        text-align: center;
                                        background-color: #4caf50;
                                        color: white;
                                        text-decoration: none;
                                        font-weight: bold;
                                        border-radius: 5px;
                                        }
                                        .verify-button:hover {
                                        background-color: #45a049;
                                        }
                                        .footer {
                                        text-align: center;
                                        margin-top: 20px;
                                        font-size: 12px;
                                        color: #777777;
                                        }
                                    </style>
                                    </head>
                                    <body>
                                    <div class="email-container">
                                        <div class="header">
                                        <h1>Welcome to Rolevista</h1>
                                        </div>
                                        <div class="content">
                                        <p>Hi {{userName}},</p>
                                        <p>Thank you for signing up with Rolevista! Please verify your email address to activate your account.</p>
                                        <p>Click the button below to complete your email verification:</p>
                                        <a href="{{verificationLink}}" class="verify-button">Verify Email</a>
                                        <p>If you didn't create this account, please ignore this email.</p>
                                        <p>Thanks,</p>
                                        <p>The Rolevista Team</p>
                                        </div>
                                        <div class="footer">
                                        <p>&copy; 2024 Rolevista. All rights reserved.</p>
                                        </div>
                                    </div>
                                    </body>
                                    </html>
                                    `
export {mailVerificationMessage};