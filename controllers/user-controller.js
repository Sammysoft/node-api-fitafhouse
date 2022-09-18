import User from "../config/user.model.schema.js";
import bcrypt from "bcrypt";
import paystack from "paystack-api";
const PayStack = paystack("My_Secret");

export const userController = {
  _onboard: async (req, res, next) => {
    const user = await new User(req.body);
    console.log(user);
    try {
      bcrypt.genSalt(10, (err, salt) => {
        !err;
        bcrypt.hash(user.password, salt, async (err, hash) => {
          !err;
          user.password = hash;
          console.log(user.accountnumber);
          const newUser = await user.save();
          res.status(200).json({
            msg: newUser,
          });
        });
      });
    } catch (error) {
      res.status(400).json({
        msg: "Could not secure password",
      });
    }
  },
  _invest: async (req, res, next) => {
    try {
      User.findById({ _id: req.params.id }, (err, user) => {
        const { plan, investmentDuration, rate, amount, isActive } = req.body;
        console.log(isActive);
        if (user.investment[0] == null) {
          const dueDate = user.endDate(investmentDuration);
          console.log(dueDate);
          const investmentDetails = {
            plan,
            investmentDuration,
            rate,
            amount,
            dueDate,
          };
          console.log(investmentDuration);
          user.investment.push(investmentDetails);
          user.save();
          User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: true } },
            (err, result) => {
              console.log(result);
              if (!err) {
                res.status(200).json({
                  result,
                });
              }
            }
          );
        } else {
          res.status(400).json({
            msg: "You already have an active investment",
          });
        }
      });
    } catch (error) {
      res.status(400).json({
        msg: "Sorry, Could not make this investment",
      });
    }
  },

  _notifications: async (req, res, next) => {
    try {
      const notification = await User.findById(req.params.id);
      res.status(200).json({
        notification: notification.notification,
      });
    } catch (error) {
      res.status(400).json({
        msg: "Could not get notifications",
      });
    }
  },
};
