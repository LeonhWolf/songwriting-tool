import fs from "fs/promises";
import ejs from "ejs";

type EmailType = "registerConfirmation";
type RegisterConfirmationInterpolationData = {
  name: string;
  confirmationLink: string;
  expiresOnDate: string;
};

export async function getInterpolatedEmailString(
  emailType: EmailType,
  interpolationData: RegisterConfirmationInterpolationData
): Promise<string> {
  const htmlString = await fs.readFile(
    `${__dirname}/../assets/register-confirmation-mail.ejs`,
    "utf-8"
  );
  const renderResult = ejs.render(htmlString, interpolationData);
  return renderResult;
}
