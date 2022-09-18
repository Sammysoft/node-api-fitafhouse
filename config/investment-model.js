import mongoose from "mongoose";

const date = new Date();
let presentDate = `0${
  date.getMonth() + 1
}/${date.getDate()}/${date.getFullYear()}`;

const investmentSchema = mongoose.Schema({
  username: {type: String},
  investor: {
    id:{type: String},
    username: { type: String },
    email: { type: String },
    phonenumber: { type: String },
  },
  investments: {
    isActive: { type: Boolean, default: false },
    plan: { type: String },
    investmentDuration: { type: Number },
    amount: { type: Number },
    rate: { type: String },
    created_at: {
      type: String,
      default: presentDate,
    },
    dueDate: {
      type: String,
    },
  },
});

investmentSchema.methods.endDate = function endDate(investmentDuration) {
  let date, extractedMonth, month, newMonth, dueDate;
  date = new Date();
  month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  extractedMonth = date.getMonth();
  newMonth = Number(extractedMonth) + Number(investmentDuration) + Number(1);
  if (newMonth >= 12) {
    newMonth -= 12;
    finalMonth = month[newMonth];
    dueDate = `0${newMonth}/${date.getDate()}/${date.getFullYear() + 1}`;
    return dueDate;
  } else {
    dueDate = `0${newMonth}/${date.getDate()}/${date.getFullYear()}`;
    return dueDate;
  }
};

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;
