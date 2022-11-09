import mongoose from "mongoose";

const payment = new mongoose.Schema({
  cab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cab",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  paymentTime: {
    type: Date,
    default: Date.now(),
  },
});

const Payment = mongoose.model("Payment", payment);

export default Payment;
