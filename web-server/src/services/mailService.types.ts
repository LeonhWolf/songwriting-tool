import { SendMailOptions } from "nodemailer";

interface ISendParametersBasic {
  toAddress: string;
  subject: string;
  from?: SendMailOptions["from"];
}
interface ISendParametersText extends ISendParametersBasic {
  textContent: string;
  htmlContent?: never;
}
interface ISendParametersHtml extends ISendParametersBasic {
  textContent?: never;
  htmlContent: string;
}
export type ISendParameters = ISendParametersText | ISendParametersHtml;
