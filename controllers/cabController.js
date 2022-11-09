import catchAsync from "../managers/catchAsync.js";
import Cab from "../models/cabModel.js";
import Payment from "../models/paymentModel.js";
import { createDoc, getAllDocs } from "../utils/HandlerFactory.js";

export const raiseCab = createDoc(Cab);

export const acceptCab = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cab = await Cab.findById(req.params.id);
  cab.acceptedBy.push(userId);
  cab.save();
  res.status(200).json({
    data: cab,
  });
});

export const cancelCab = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cab = await Cab.findById(req.params.id);
  cab.acceptedBy.pop(userId);
  cab.save();
  res.status(200).json({
    data: cab,
  });
});

export const endCab = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const cab = await Cab.findById(req.params.id);
  cab.isActive = false;
  cab.save();
  res.status(200).json({
    data: cab,
  });
});

export const makePayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.create({
    cab: req.params.id,
    user: req.user.id,
    amount: req.body.amount,
  });
  res.status(200).json({
    data: payment,
  });
});

export const getAllCabs = getAllDocs(Cab);
