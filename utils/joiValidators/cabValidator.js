import Joi from "joi";
import catchAsync from "../../managers/catchAsync.js";

const joiCabCreateSchema = Joi.object({
  fromLocation: {
    landmark: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
  },
  toLocation: {
    landmark: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
  },
  raisedBy: Joi.string(),
  noOfSeats: Joi.number(),
  price: Joi.number(),
  pickUpTime: Joi.date(),
  duration: Joi.number(),
  timeRaised: Joi.forbidden(),
  gender: Joi.string(),
  acceptedBy: Joi.forbidden(),
  isActive: Joi.forbidden(),
});

export const joiCabCreateValidator = catchAsync(async (req, res, next) => {
  req.body.raisedBy = req.user.id;
  const value = await joiCabCreateSchema.validateAsync(req.body);
  next();
});
