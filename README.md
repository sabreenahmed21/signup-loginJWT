<h1>A Full-Stack MERN Authentication and Authorization Application </h1>
<p>
  This project is a login and sign-up application includes features for forgetting password, verifying email, logging out, deleting account, and private route.
</p>
<h4>login</h4>
<p>
the user enters their username and password in the login form. If the username and password are correct, a login token (JWT) will be generated and sent to the user. This token can be used to login to the application in future instances.
</p>
<h4>
Sign up
</h4>
<p>
the user enters their username, password, and email in the sign-up form. If this information is correct, a new account will be created in the database. An email will be sent to the provided email to confirm the account.
</p>
<h4>
Forgot password
</h4>
<p>
If the user forgets their password, they can request to have a password reset link sent to their email. When the link is clicked, the user will be directed to a page where they can enter a new password.
</p>
<h4>
Verify email
</h4>
<p>
Before the user can login, they must verify their email. To do this, they must enter code in verification code provided in the email sent to the user.
</p>
<h4>
Logout
</h4>
<p>
To logout, the user must click the "Logout" button in the profile page.
</p>
<h4>
Delete account
</h4>
<p>
To delete their account, the user must click the "Delete account" button on their profile page.
</p>
<h4>
Private route
</h4>
<p>
The private route can only be accessed by logged-in users.
</p>
<h4>The project uses the following technologies:</h4>
    <li>React.js</li> 
    <li>Mui</li>
    <li>Redux Toolkit</li> 
    <li>React-hook-form</li>
    <li>Node.js</li>
    <li>Express</li>
    <li>MongoDB</li>
    <li>Nodemailer</li>
    <li>JSON Web Token</li>

### To download the project, you can use the following commands:

1. Clone the repo
   ```sh
   https://github.com/sabreenahmed21/signup-loginJWT.git
   ```
2. install:
   ```sh
   npm install
   ```
3. Run the app:
  ```sh
   cd client

   npm start
   ```
   ```sh
   cd server

   npm start
   ```
