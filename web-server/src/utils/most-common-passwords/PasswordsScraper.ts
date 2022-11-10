import fs from "fs";
import puppeteer from "puppeteer";

// UNTESTED!

function writeStringifiedToTxt(passwords: (string | null)[]): void {
  const file = fs.createWriteStream(
    `${__dirname}/200-most-common-passwords.txt`
  );
  file.on("error", (error) => {
    console.error(error);
  });
  file.write(JSON.stringify(passwords));
}

(async function scrapeToTxtFile() {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto("https://nordpass.com/most-common-passwords-list/");
  const passwordElements = await page.$$(
    "div.Findings__table .Findings__table-inner .flex .Findings__password"
  );
  const passwordsPromises = await passwordElements.map((passwordElement) => {
    const passwordPromise = passwordElement.evaluate(
      (element) => element.textContent
    );
    return passwordPromise;
  });
  const passwords = await Promise.all(passwordsPromises);

  writeStringifiedToTxt(passwords);

  await browser.close();
})();
