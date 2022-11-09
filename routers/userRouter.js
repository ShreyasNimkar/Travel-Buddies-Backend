import express from "express";
import { signup, login, protect } from "../Controllers/authController.js";
import {
  getAllUsers,
  UpdatePassword,
  getUser,
  deleteUser,
} from "../Controllers/userController.js";
import { joiUserCreateValidator } from "../utils/joiValidators/userValidator.js";

const userRouter = express.Router();

userRouter.post("/signup", joiUserCreateValidator, signup);
userRouter.post("/login", login);

userRouter.patch("/updatePassword", protect, UpdatePassword);

userRouter.get("/", getAllUsers);
userRouter.route("/:userID").get(protect, getUser).delete(protect, deleteUser);

export default userRouter;
