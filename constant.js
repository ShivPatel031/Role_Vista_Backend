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

const adminApprovalMessage = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background: #f1f1f1;
            font-size: 12px;
            color: #666666;
        }
        .info {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-left: 4px solid #4CAF50;
        }
        .info p {
            margin: 0;
            line-height: 1.4;
        }
        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Rolevista</h1>
        </div>
        <div class="content">
            <p>Dear <b>{{name}}</b>,</p>
            <p>We are pleased to inform you that your account has been approved by the admin. You now have access to the platform based on your assigned role and permissions.</p>
            <div class="info">
                <p><strong>Name:</strong> {{name}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Role:</strong> {{role}}</p>
                <p><strong>Branch:</strong> {{branch}}</p>
            </div>
            <p>You can now log in and start contributing by posting and commenting on the platform.</p>
            <a class="button" href="{{loginLink}}">Log in to Rolevista</a>
            <p>If you have any questions, feel free to reach out to us at support@rolevista.com.</p>
            <p>Thank you for being a part of our community!</p>
        </div>
        <div class="footer">
            &copy; 2024 Rolevista. All rights reserved.
        </div>
    </div>
</body>
</html>`;

const adminDisapprovalMessage =  `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #f44336;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background: #f1f1f1;
            font-size: 12px;
            color: #666666;
        }
        .info {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-left: 4px solid #f44336;
        }
        .info p {
            margin: 0;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Request Disapproved</h1>
        </div>
        <div class="content">
            <p>Dear <b>{{name}}</b>,</p>
            <p>We regret to inform you that your account request on Rolevista has been disapproved by the admin. Unfortunately, this means you will not be able to access the platform at this time.</p>
            <div class="info">
                <p><strong>Name:</strong> {{name}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Requested Role:</strong> {{role}}</p>
            </div>
            <p>If you believe this decision was made in error or you have additional questions, please feel free to contact us at support@rolevista.com.</p>
            <p>Thank you for your understanding.</p>
        </div>
        <div class="footer">
            &copy; 2024 Rolevista. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export {mailVerificationMessage,adminApprovalMessage,adminDisapprovalMessage};