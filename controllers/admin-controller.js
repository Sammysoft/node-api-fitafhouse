import User from "../config/user.model.schema.js";
import Investment from "../config/investment-model.js";
import { sendMail } from "../config/mail-service.js";

function endDate(investmentDuration) {
  let date, extractedMonth, month, newMonth, dueDate, finalMonth;
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
}

export const adminController = {
  _deleteInvestment: async (req, res, next) => {
    Investment.findOneAndDelete({ _id: req.params.id }, (err, result) => {
      if (err) {
        res.status(200).json({
          msg: "Could not delete this investment",
        });
      } else {
        res.status(200).json({
          data: req.user,
          msg: "Deleted Succesfully",
        });
      }
    });
  },
  _getUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json({
        Investors: users,
      });
    } catch (error) {
      res.status(400).json({
        msg: "Could Not Fetch Users",
      });
    }
  },
  _getStats: async (req, res, next) => {
    const numberOfActiveInvestors = await Investment.find({}).count();
    const numberOfUsers = await User.find({}).count({});
    res.status(200).json({
      numberOfActiveInvestors: numberOfActiveInvestors,
      numberOfUsers: numberOfUsers,
    });
  },
  _getActiveInvestors: async (req, res, next) => {
    const investorsStats = await User.find({ isActive: true }).count();
    const investors = await Investment.find({});
    res.status(200).json({
      investorsStats,
      investors,
    });
  },
  _approveInvestment: async (req, res, next) => {
    try {
      const investment = await Investment.findById({ _id: req.params.id });
      const { investmentDuration, amount, plan, rate, created_at } =
        investment.investments;
      const { username, email } = investment.investor;
      Investment.findOne({ _id: req.params.id }, (err, result) => {
        !err;
        result.investments.isActive = true;
        result.investments.dueDate = endDate(investmentDuration);
        result.save();
        const senderMail = "FITAFHOUSE <fitafhouse@gmail.com>";
        const name = username;
        const recieverMail = email;
        const text = `<b>Hello ${name}</b>`;
        const subject = `Investments Has Been Approved ${name}`;
        const body = `${username} we are happy to inform you that, your investment of <b>N${amount}</b> on <b>${created_at}</b> has just been approved!.
                                You can login to your account and check your dashboard to see the details of your investment. You will recieve <b>10% fixed ROI after 12months plus a varied ROI</b>.`;
        sendMail(senderMail, recieverMail, subject, text, name, body, (err) => {
          if (err) {
            console.log("Mail Not Sent " + err);
          } else {
            console.log("Mail Sent");
          }
        });
        res.status(200).json({
          msg: "Investment has been approved",
        });
      });
    } catch (error) {
      res.status(400).json({
        msg: "Investment Could not be approved",
      });
    }
  },
  _notifyInvestor: async (req, res, next) => {
    const investor = await User.findById(req.params.id);
    const { username, email } = investor;
    const { message } = req.body;
    User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { notification: message } },
      (err, result) => {
       if(result){
        res.status(200).json({ msg: "Notification Sent to @" + username });
        const senderMail = "FITAFHOUSE <fitafhouse@gmail.com>";
        const name = username;
        console.log(name);
        const recieverMail = email;
        const text = `<b>Hello ${name}</b>`;
        const subject = `Notification`;
        const body = `<i>${message}</i>`;
        sendMail(senderMail, recieverMail, subject, text, name, body, (err) => {
          if (err) {
            console.log("Mail Not Sent " + err);
          } else {
            console.log("Mail Sent");
          }
        });
       }else{
        res.status(400).json({
          msg: "Internal Server Error"
        })
       }
      }
    );
  },

  _notifyInvestors: async (req, res, next) => {
    const { message } = req.body;
    try {
      const investor = await User.updateMany(
        { isActive: true },
        { notification: message }
      );
      console.log(investor);

      res.status(400).json({ msg: "All investors has been notified!" });
    } catch (error) {
      res.status(400).json({ msg: "Could not initiate bulk notification" });
    }
  },
};
