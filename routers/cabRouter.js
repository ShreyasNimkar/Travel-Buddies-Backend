import express from "express";
import { signup, login, protect } from "../Controllers/authController.js";
import {
  raiseCab,
  makePayment,
  getAllCabs,
  cancelCab,
  acceptCab,
  endCab,
} from "../controllers/cabController.js";
import { joiCabCreateValidator } from "../utils/joiValidators/cabValidator.js";

const cabRouter = express.Router();

cabRouter.post("/new", protect, joiCabCreateValidator, raiseCab);
cabRouter.get("/accept/:id", protect, acceptCab);
cabRouter.get("/cancel/:id", protect, cancelCab);
cabRouter.get("/end/:id", protect, endCab);

cabRouter.post("/payment/:id", protect, makePayment);

cabRouter.get("/allCabs", protect, getAllCabs);

export default cabRouter;
