import User from "../config/user.model.schema.js";
import Message from "../config/message.model.schemma.js";
import Investment from "../config/investment-model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../config/mail-service.js";
import got from "got";

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

function startDate() {
  const date = new Date();
  let presentDate = `0${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return presentDate;
}

export const userController = {
  _onboard: async (req, res, next) => {
    const { username, fullname, email, accountnumber, bank, password } =
      req.body;
    const testuser = await User.findOne({ username: username });
    if (testuser) {
      res.status(400).json({
        msg: "Username already exists!",
      });
    } else {
      if (
        !username ||
        !fullname ||
        !email ||
        !accountnumber ||
        !bank ||
        !password
      ) {
        res.status(400).json({ msg: "Please, fill in all details!" });
      } else {
        const user = await new User(req.body);
        console.log(user);
        try {
          bcrypt.genSalt(10, (err, salt) => {
            !err;
            bcrypt.hash(user.password, salt, async (err, hash) => {
              !err;
              user.password = hash;
              const newUser = await user.save();
              res.status(200).json({
                msg: newUser,
              });
              const senderMail = "FITAFHOUSE <fitafhouse@gmail.com>";
              const name = username;
              const recieverMail = email;
              const text = `<b>Hello ${name}</b>`;
              const subject = `Welcome ${name}`;
              const body = `${username}, Your account has been succesfully created on FITAFHOUSE, we are happy to have you onboard. You can start making investments today!.
                                      We will be in touch with you. For more enquiries contact +234 80 3666 2233 OR +234 91 3030 0894, You may also reply this email.
                                 `;
              sendMail(
                senderMail,
                recieverMail,
                subject,
                text,
                name,
                body,
                (err) => {
                  if (err) {
                    console.log("Mail Not Sent");
                  } else {
                    console.log("Mail Sent");
                  }
                }
              );
            });
          });
        } catch (error) {
          res.status(400).json({
            msg: "Could not secure password",
          });
        }
      }
    }
  },
  _invest: async (req, res, next) => {
    try {
      User.findById({ _id: req.params.id }, (err, user) => {
        const {
          plan,
          investmentDuration,
          rate,
          amount,
          username,
          phonenumber,
          email,
          investorID,
        } = req.body;

        const dueDate = endDate(investmentDuration);
        const investmentPayload = {
          dueDate: dueDate,
          plan: plan,
          investmentDuration: investmentDuration,
          rate: rate,
          amount: amount,
          created_at: startDate(),
        };

        const investorsPayload = {
          username: username,
          email: email,
          phonenumber: phonenumber,
          id: investorID,
        };

        const invest = new Investment();
        invest.username = username;
        invest.investor = investorsPayload;
        invest.investments = investmentPayload;
        invest.save();
        console.log(investorID);
        res.status(200).json({
          data: invest,
        });
        const senderMail = "FITAFHOUSE <fitafhouse@gmail.com>";
        const name = username;
        const recieverMail = email;
        const text = `<b>Hello ${name}</b>`;
        const subject = `Payments Awaiting Approval`;
        const body = `${username}, Your Investment of <b>N${amount}</b> is presently undergoing approval.
                              You will be notified once your payments has been approved. within the next 24 hours. Please be patient.
                              For more enquiries contact +234 80 3666 2233 OR +234 91 3030 0894, You may also reply this email.
                         `;
        sendMail(senderMail, recieverMail, subject, text, name, body, (err) => {
          if (err) {
            console.log("Mail Not Sent");
          } else {
            console.log("Mail Sent");
          }
        });
      });
    } catch (error) {
      res.status(400).json({
        msg: "Sorry, Could not make this investment, contact support",
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

  _initiatePayments: async (req, res, next) => {
    const { amount, email, phonenumber, username } = req.body;
    console.log(username + email);
    const exactAmount = Number((amount * 1.42) / 100) + Number(amount);
    console.log(exactAmount);
    try {
      const response = await got
        .post("https://api.flutterwave.com/v3/payments", {
          headers: {
            Authorization: `Bearer FLWSECK-e2581a50a3c72e614dd2c3fdd829ee08-X`,
          },
          json: {
            tx_ref: (Math.random() + 1).toString(36).substring(7),
            amount: `${exactAmount}`,
            currency: "NGN",
            redirect_url: `https://fitafhouse.com/dashboard/investments?amount=${amount}&plan=Yearly&email=${email}&phonenumber=${phonenumber}&rate=10% per annum&duration=12`,
            customer: {
              email: `${email}`,
              phonenumber: `${phonenumber}`,
              name: `${username}`,
            },
            customizations: {
              title: "FITAFHOUSE INVESTMENTS",
              logo: "https://firebasestorage.googleapis.com/v0/b/file-uploads-55ed9.appspot.com/o/logo.png?alt=media&token=6156423f-23d3-42bd-ab13-6cadcdbef6d5",
              description:
                "Payments Through a secured payments gateway, Flutterwave",
            },
          },
        })
        .json();
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      console.log(err.code);
      console.log(err.response.body);
    }
  },
  _updateProfile: async (req, res, next) => {
    const {
      username,
      fullname,
      email,
      phonenumber,
      bank,
      accountnumber,
      oldpassword,
      password,
    } = req.body;
    try {
      const user = await User.findById({ _id: req.params.id });
      if (password != null) {
        bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
          if (isMatch) {
            try {
              bcrypt.genSalt(10, (err, salt) => {
                !err;
                bcrypt.hash(password, salt, async (err, hash) => {
                  !err;
                  user.password = hash;
                  user.fullname = fullname;
                  user.email = email;
                  user.username = username;
                  user.bank = bank;
                  user.accountnumber = accountnumber;
                  user.phonenumber = phonenumber;
                  const newUser = await user.save();
                  res.status(200).json({
                    msg: `Updated Profile Successfully`,
                    data: newUser,
                  });
                });
              });
            } catch (error) {
              res.status(400).json({
                msg: "Could not secure password",
              });
            }
          } else {
            res.status(400).json({
              msg: "Old password is wrong, contact support for other ways to change password",
            });
          }
        });
      } else if (password == null) {
        User.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              fullname: fullname,
              username: username,
              bank: bank,
              accountnumber: accountnumber,
              email: email,
              phonenumber: phonenumber,
            },
          },
          (err, user) => {
            if (!err) {
              res.status(200).json({
                data: user,
                msg: `updated your records successfully`,
              });
            } else {
              res.status(400).json({
                msg: "Could not update record, Contact support for help.",
              });
            }
          }
        );
      }
    } catch (error) {
      res.status(400).json({
        msg: "Failed to update your record, could not reach server at the moment",
      });
    }
  },
  _sendMessage: async (req, res, next) => {
    const { message, username, email } = req.body;
    if (!username || !email) {
      res.status(400).json({
        msg: "Please Provide your username and email address",
      });
    }
    const messageBody = await new Message(req.body);
    if (messageBody) {
      messageBody.save();
      res.status(200).json({
        msg: `@${username}, We have recieved your message and will get back to you soon!, Thank You for using FITAFHOUSE`,
      });
      const senderMail = `${username} <${email}>`;
      const name = username;
      const recieverMail = `fitafhouse@gmail.com`;
      const text = `Hello Admin`;
      const subject = `Message from ${name}`;
      const body = `${message}`;
      sendMail(senderMail, recieverMail, subject, text, name, body, (err) => {
        if (err) {
          console.log("Mail Not Sent " + err);
        } else {
          console.log("Mail Sent");
        }
      });
    } else {
      res.status(400).json({
        msg: "A very terrible error occured, please try again later",
      });
    }
  },
  _getMessages: async (req, res, next) => {
    const messages = await Message.find();
    if (!messages) {
      res.status(400).json({
        msg: "Failed to get Messages",
      });
    } else {
      res.status(200).json({
        data: messages,
      });
    }
  },

  _getInvestments: async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      const { fullname } = user;
      console.log(fullname);
      const myInvestment = await Investment.find({ username: fullname });
      console.log(myInvestment);
      if (myInvestment) {
        console.log(myInvestment);
        res.status(200).json({
          result: myInvestment,
        });
      } else if (!myInvestment) {
        res.status(200).json({
          data: [],
        });
      }
    } catch (error) {
      res.status(400).json({
        data: "An error occured when fetching investments " + error,
      });
    }
  },

  _forgotPassword: async (req, res, next) => {
    const { email } = req.body;
    console.log(email);

    try {
      User.findOne({ email: email }, (err, user) => {
        if (user) {
          const userID = user._id;
          console.log(userID);
          res.status(200).json({
            msg: `An Email link to reset your password has been sent to ${email}`,
          });
          const senderMail = `FITAFHOUSE <fitafhouse@gmail.com>`;
          const message = `Please open the link provided to reset your password <link><a href="https://www.fitafhouse.com/password-reset/${userID}" target="_blank">https://www.fitafhouse.com/password-reset/${userID}<a/></link>`;
          const name = user.username;
          const recieverMail = `${email}`;
          const text = `Hello, ${name}`;
          const subject = `Password Reset`;
          const body = `${message}`;
          sendMail(
            senderMail,
            recieverMail,
            subject,
            text,
            name,
            body,
            (err) => {
              if (err) {
                console.log("Mail Not Sent");
              } else {
                console.log("Mail Sent");
              }
            }
          );
        } else {
          res.status(400).json({
            msg: "The email account provided is not registered!",
          });
        }
      });
    } catch (error) {
      res.status(400).json({
        msg: "Internal Error, Please contact support!",
      });
    }
  },

  _resetPassword: async (req, res, next) => {
    const { password } = req.body;
    try {
     const user = await User.findById({ _id: req.params.id })
        if (user) {
          console.log(user.username)
          bcrypt.genSalt(10, (err, salt) => {
            !err;
            bcrypt.hash(password, salt, async (err, hash) => {
              !err;
              user.password = hash;
              const newUserPassword = await user.save();
              res.status(200).json({
                data: newUserPassword,
                msg: `Your password has been updated successfully`,
              });
            });
          });
        } else {
          res.status(400).json({
            msg: "Could not Update password, please contact support",
          });
        }
    } catch (error) {
      res.status(400).json({
        msg: "Internal Server Error!",
      });
    }
  },
};
