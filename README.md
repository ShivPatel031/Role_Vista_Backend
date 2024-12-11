
# RoleVista  

**RoleVista** is a role-based access control (RBAC) system built with the MERN stack. This project enables users to post comments, like posts, and interact within their designated roles: **Admin**, **Sub-Admin**, and **User**. It incorporates secure user authentication, email verification, and hierarchical permission management to ensure an efficient and secure platform.  

## Features  

### Role-Based Access Control (RBAC):  
1. **Admin**:  
   - Approve or reject user registration requests.  
   - Restrict or unblock sub-admins and users.  
   - Delete any user's posts or comments.  
2. **Sub-Admin**:  
   - Manage users within the same branch.  
   - Restrict user actions such as posting or commenting.  
   - Delete posts or comments within their branch.  
3. **User**:  
   - Post content, like, and comment.  

### Core Functionalities:  
- **User Registration & Verification**:  
  - Email verification via **Nodemailer**.  
  - Registration requests must be approved by an admin.  
- **Authentication**:  
  - Secure authentication using **JWT tokens**.  
- **Content Management**:  
  - Users and Sub-Admins can create, manage, and delete posts and comments as per their roles.  
- **Image Handling**:  
  - Images are stored and managed using **Cloudinary**.  

## Technologies Used  

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT (JSON Web Tokens)  
- **Email Services**: Nodemailer  
- **Image Storage**: Cloudinary  

## Project Workflow  

1. **User Registration**:  
   - Users register via the signup form.  
   - An email verification link is sent to the user.  
   - Once verified, the registration request goes to the admin for approval.  

2. **Role-Based Permissions**:  
   - Users can post, like, and comment.  
   - Sub-Admins can manage users and content within their branch.  
   - Admins have full control over the platform, including approving/rejecting users and managing sub-admins.  

3. **Branch Restrictions**:  
   - Sub-Admins and users can only interact with other users and content within their assigned branch.  

## Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/ShivPatel031/RoleVista.git  
   ```  
2. Install dependencies:  
   ```bash  
   cd RoleVista  
   npm install  
   ```  
3. Set up the environment variables:  
   - Create a `.env` file with the following keys:  
     - `MONGO_URI`: MongoDB connection string.  
     - `JWT_SECRET`: Secret key for JWT tokens.  
     - `CLOUDINARY_URL`: Cloudinary API credentials.  
     - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`: Email service credentials for Nodemailer.  

4. Run the application:  
   ```bash  
   npm start  
   ```  

## Project Link  

- [GitHub Repository](https://github.com/ShivPatel031/RoleVista)  

## Learning Outcomes  

- Mastered role-based access control with hierarchical permissions.  
- Implemented secure email verification and user authentication using JWT.  
- Integrated Cloudinary for efficient image management.  
- Gained experience with full-stack development using the MERN stack.  

---  

Feel free to modify the content based on your preferences or add additional sections like screenshots or a live demo link.
