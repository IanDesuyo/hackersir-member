import { createTransport, type SendMailOptions } from "nodemailer";
import { env } from "../env.mjs";

const transporter = createTransport(env.SMTP_URL);

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  }
});

export const sendEmail = async (options: SendMailOptions) => {
  console.log("[Email] Sending", options.subject, options.to);
  options.from = {
    name: env.SMTP_NAME,
    address: env.SMTP_FROM,
  };
  options.sender = env.SMTP_FROM;

  return await transporter.sendMail(options, (err, info) => {
    if (err) {
      console.error(err);
    }

    console.log("[Email] Sent", info.response, { accepted: info.accepted, rejected: info.rejected });
  });
};
