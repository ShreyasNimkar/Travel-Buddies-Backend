import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import AppError from "../managers/AppError.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide the email"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    age: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm the password"],
      validate: {
        validator: function (el) {
          return el == this.password;
        },
        message: "Passwords do not match",
      },
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    isTravelAgency: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password != this.confirmPassword)
    return next(new AppError("Passwords do not match", 400));
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (inPass, userPass) {
  return await bcrypt.compare(inPass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestrap) {
  const changedTimestrap = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return JWTTimestrap < changedTimestrap;
};

const User = mongoose.model("User", userSchema);

export default User;
