import nodemailer, { Transporter } from "nodemailer";

import { logger } from "../utils/logger";
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
  ) {
    logger.log(
      "error",
      "Email service could not be initialized. Not all environment variables for email config were set."
    );
    return;
  }

  _transporter = getTransporter();

  _transporter
    .verify()
    .then(() => {
      logger.log("info", "The mail transporter has been verified.");
      _isTransporterVerified = true;
    })
    .catch((error) => {
      logger.log("error", `Email service could not be verified. ${error}`);
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

  try {
    await _transporter.sendMail({
      to: sendParameters.toAddress,
      subject: sendParameters.subject,
      text: sendParameters.textContent,
      html: sendParameters.htmlContent,
      from: sendParameters.from,
    });
  } catch (error) {
    // Promise.reject(`Email service could not be verified. ${error}`);
    logger.log("warn", `Email could not be sent. ${error}`);
    throw new Error(`Email could not be sent. ${error}`);
  }
};
