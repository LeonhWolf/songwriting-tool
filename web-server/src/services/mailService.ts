import nodemailer, { Transporter } from "nodemailer";

import { ISendParameters } from "./mailService.types";

let _isTransporterVerified = false;
let _transporter: Transporter;

initTransporter();

function initTransporter(): void {
  if (
    !process.env.MAIL_HOST ||
    !process.env.MAIL_PORT ||
    !process.env.MAIL_USER ||
    !process.env.MAIL_PASSWORD
  )
    return;

  _transporter = getTransporter();

  _transporter
    .verify()
    .then(() => {
      _isTransporterVerified = true;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getTransporter(): Transporter {
  const host = process.env.MAIL_HOST;
  const port = parseInt(process.env.MAIL_PORT ?? "");
  const user = process.env.MAIL_USER;
  const password = process.env.MAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: user,
      pass: password,
    },
  });

  return transporter;
}

export const send = async (sendParameters: ISendParameters): Promise<void> => {
  if (!_isTransporterVerified)
    throw new Error("'transporter' is not verified.");
  await _transporter.sendMail({
    to: sendParameters.toAddress,
    subject: sendParameters.subject,
    text: sendParameters.textContent,
    html: sendParameters.htmlContent,
    from: sendParameters.from,
  });
};
