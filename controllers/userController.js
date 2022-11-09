import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import { createSendToken } from "./authController.js";
import { getAllDocs, getDoc, updateDoc } from "../utils/HandlerFactory.js";

const filterObj = (obj, ...fields) => {
  const filteredBody = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) filteredBody[el] = obj[el];
  });
  return filteredBody;
};

export const getAllUsers = getAllDocs(User);

export const getUser = getDoc(User);

export const updateUser = updateDoc(User);

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    requestedAt: req.requestedAt,
    data: null,
  });
});

export const UpdatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(
      new AppError("Incorect Password, Please enter the corrent password", 401)
    );

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  await user.save();

  createSendToken(user, 200, res);
});
