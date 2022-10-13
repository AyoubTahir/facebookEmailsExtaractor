import { promises } from "fs";
import loginBot from "./loginBot.js";
import extractEmails from "./extractEmails.js";

const facebookBot = async (account, puppeteerExtra) => {
  const browser = await puppeteerExtra.launch({
    args: ["--start-maximized"],
    headless: false,
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
    executablePath:
      "C://Program Files//Google//Chrome//Application//chrome.exe",
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  //Login to Facebook account
  await loginBot(
    page,
    account.email,
    account.password,
    account.cookiesFileName
  );

  for (let i = 0; i < account.linksToExtarct.length; i++) {
    //Extract Emails from the giving link
    await extractEmails(
      page,
      account.linksToExtarct[i],
      account.numberOfPostsToExtract
    );

    //await promises.writeFile("./cleanEmailsList.txt", cleanEmailsList);
  }

  console.log("finished!!!");
};

export default facebookBot;
