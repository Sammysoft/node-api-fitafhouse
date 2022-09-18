import nodemailer from "nodemailer";
import mailGun from "nodemailer-mailgun-transport";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: 'postmaster@fitafhouse.com',
    pass: 'e9eff0ae9aeea8bbf8533a30d85ca880-523596d9-5e3675b1'
  }}
  );


export const sendMail = (senderMail, recieverMail, subject, text, name, body, cb) => {
  const mailOptions = {
    from: senderMail,
    to: recieverMail,
    subject: subject,
    text: text,
    html: `<div style="background-color: white; width: 100%; margin: auto; padding: 5px;">
                    <div style="color: green; font-weight: 700; margin: auto;  width: auto; font-family: cursive; font-size: 2rem; ">
                        <img src="https://firebasestorage.googleapis.com/v0/b/crave-uploads.appspot.com/o/images%2Flogo.png4a292797-ace9-4b28-aba0-bdd4a4907cf0?alt=media&token=0f43fd92-4ecd-47f6-b1f1-98c59535a312"
                         height="50px" width="50px" style="float: left"/>
                         <span> FITAF</span><span style="color: yellow;">HOUSE</span>

                    </div>
                    <br/><br/>
                    <p>${text}</p><br/><br/>
                    <p>
                        ${body}

                    </p><br/><br/>
                    <p>Thanks for choosing FITAFHOUSE | Your finances is secured!</p>
                </div>
                    `,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};
