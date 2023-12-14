import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 4,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    active :{
      type: Boolean,
      default: true,
      select: false,
    },
    verified: { type: Boolean, default: false },
    verificationCode: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// !hash password
userSchema.pre('save',async function (next) {
  //only run this function if the user modify the password
  if (!this.isModified('password')) return next();
  //hash the password
  this.password =await bcrypt.hash(this.password, 12);
  // delete passwordconfirm
  this.passwordConfirm = undefined;
  next();
});

//! modify the password
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//! delete the profile
userSchema.pre(/^find/, function(next){
  this.find({active: {$ne: false}});
  next();
});

//! compare the password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//! if password changed
userSchema.methods.changedPasswordAfter = function (JWTTimesTamp) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt > JWTTimesTamp;
  }
  // false means that the password was not changed
  return false;
};

//! token reset password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(4).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default mongoose.model("Usermodel", userSchema);