import asyncWrapper from "../Middleware/AsyncWrapper.js";
import HttpStatusText from "../Utilis/HttpStatusText.js";
import Usermodel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../Utilis/email.js";
import AppError from "../Utilis/AppError.js";

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateJwt(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    state: HttpStatusText.SUCCESS,
    token,
    data: { user },
  });
};

export const protect = asyncWrapper(async (req, res, next) => {
  // 1) Getting the token and checking if it's there
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access', 401, 'fail'));
    }
  //2) verification token 
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  //3) check if user still exists
  const user = await Usermodel.findById(decoded.id);
  if(!user) {
    return next(new AppError('User belonging to this token does not longer exist.', 404, 'fail'))
  }
  //4) check if user is still active
  if(user.isActive === false) {
    return next(new AppError('Your account has been deactivated', 401, 'fail'))
  }
  //5) check if user changed password after token was issued
  if(user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login again', 401, 'fail'))
  }
  //6) if everything ok, save user in req
  req.user = user;
  next();
});

export const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const existingUser = await Usermodel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered." });
  }
  const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  const newUser = new Usermodel({
    name,
    email,
    password,
    passwordConfirm,
    verificationCode,
  });
  await newUser.save();
  sendMail({
    email: newUser.email,
    subject: "Email Verification Code",
    message: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
            }
            p {
              margin-bottom: 15px;
              font-size:19px;
            }
            .verify-code {
              padding: 10px;
              background-color: #dda15e;
              color: #000;
              font-size: 18px;
              font-weight: 800;
              border-radius: 5px;
              border: 2px solid #bc6c25;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>Your verification code is: </p>
            <div class="verify-code">${verificationCode} </div>
            <p>This code will expire 5 minutes after it is sent. </p>
          </div>
        </body>
      </html>`,
  });
  createSendToken(newUser, 201, res);
});

export const verifyEmail = asyncWrapper(async (req, res, next) => {
  const { verificationCode } = req.query;
  const user = await Usermodel.findOne({
    verificationCode: { $regex: new RegExp(`^${verificationCode}$`, "i") },
  });
  console.log(user);
  if (!user) {
    return res.status(400).json({ error: "Invalid verification code." });
  }
  // Check if the verification code has expired
  const verificationCodeExpirationTime = 5 * 60 * 1000; // 5 minutes
  const currentTime = new Date().getTime();
  if (user.createdAt.getTime() + verificationCodeExpirationTime < currentTime) {
    return res.status(400).json({ error: "Verification code has expired." });
  }
  user.verified = true;
  user.verificationCode = null;
  await user.save();
  return res.json({ message: "Email verified successfully." });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(
        "Please provide your Email and Password",
        400,
        HttpStatusText.FAIL
      )
    );    
  }
  const user = await Usermodel.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User not found", 401, HttpStatusText.FAIL));
  }
  if (!user.verified) {
    return next(new AppError("User not verified", 401, HttpStatusText.FAIL));
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError("Incorrect password", 401, HttpStatusText.FAIL));
  }
  createSendToken(user, 200, res);
});

export const forgetPassword = asyncWrapper(async (req, res, next) => {
  //1) get user based on email
  const user = await Usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with email address", 404, "fail")
    );
  }
  //2) create reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) send email
  try {
    sendMail({
      email: user.email,
      subject: `${resetToken} It is your account recovery code`,
      message: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              box-shadow: 13px 13px 20px -11px rgba(0,0,0,0.75);
              -webkit-box-shadow: 13px 13px 20px -11px rgba(0,0,0,0.75);
              -moz-box-shadow: 13px 13px 20px -11px rgba(0,0,0,0.75);
            }
            p {
              margin-bottom: 15px;
              font-size:19px;
            }
            .reset-code {
              padding: 10px;
              background-color: #dda15e;
              color: #000;
              font-size: 18px;
              font-weight: 800;
              border-radius: 5px;
              border: 2px solid #bc6c25;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello, ${user.name} 👋</h2>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please use the following code to complete the password reset process:</p>
            <div class="reset-code">${resetToken}</div>
            <p>This code will expire 10 minutes after it is sent. </p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          </div>
        </body>
      </html>`,
    });
    res.status(200).json({
      status: "success",
      message: "An email has been sent to you with further instructions",
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Please try again!",
        500,
        "error"
      )
    );
  }
});

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await Usermodel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("token is invalid", 404, HttpStatusText.FAIL));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

export const verifyCode = asyncWrapper(async (req, res, next) => {
  const { code } = req.body;
  const user = await Usermodel.findOne({
    passwordResetToken: crypto.createHash("sha256").update(code).digest("hex"),
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid verification code", 400, HttpStatusText.FAIL));
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Verification code is valid",
    data: code,
  });
});

// export const deleteUnverifiedAccounts = async () => {
//   try {
//     const verificationCodeExpirationTime = 5 * 60 * 1000;
//     const currentTime = new Date().getTime();
//     const unverifiedAccounts = await Usermodel.find({
//       verified: false,
//       createdAt: {
//         $lt: new Date(currentTime - verificationCodeExpirationTime),
//       },
//     });
//     for (const account of unverifiedAccounts) {
//       await Usermodel.deleteOne({ _id: account._id });
//     }
//   } catch (error) {
//     console.error(
//       "An error occurred while deleting unverified accounts:",
//       error.message
//     );
//   }
// };
