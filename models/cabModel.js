import mongoose from "mongoose";

const cabSchema = new mongoose.Schema({
  fromLocation: {
    landmark: String,
    city: String,
    street: String,
  },
  toLocation: {
    landmark: String,
    city: String,
    street: String,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  noOfSeats: Number,
  price: Number,
  pickUpTime: Date,
  duration: Number,
  timeRaised: Date,
  gender: {
    type: String,
    enum: ["male", "female", "both"],
  },
  acceptedBy: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

cabSchema.virtual("payments", {
  ref: "Payment",
  foreignField: "cab",
  localField: "_id",
});

cabSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

const Cab = mongoose.model("Cab", cabSchema);

export default Cab;
