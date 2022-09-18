import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Investor",
    },
    isActive: {
      type: Boolean,
    },
    approved: {
      type: Boolean,
    },
    accountnumber: {
      type: Number,
    },
    bank: {
      type: String,
    },
    notification: { type: String, default: "Hey there, Welcome to FITAFHOUSE" },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
export default User;
