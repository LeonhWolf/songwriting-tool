import { SendMailOptions } from "nodemailer";

interface IAddress {
  name: string;
  address: string;
}
interface ISendParametersBasic {
  toAddress: string;
  subject: string;
  from: IAddress;
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
