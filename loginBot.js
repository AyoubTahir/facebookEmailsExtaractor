import { promises } from "fs";

const loginBot = async (page, emailOrUsername, password, cookiesFileName) => {
  try {
    //load cookies
    const cookiesString = await promises.readFile(
      "./" + cookiesFileName + ".json"
    );
    const oldCookies = JSON.parse(cookiesString);
    await page.setCookie(...oldCookies);
    console.log("./" + cookiesFileName + ".json");
  } catch (err) {
    console.log("No data saved need to login again!!!");
  }

  await page.waitForTimeout(3000);
  await page.goto("https://www.facebook.com/", { waitUntil: "load" });

  try {
    await page.waitForSelector("input[name='email']");
    await page.type("input[name='email']", emailOrUsername, {
      delay: 150,
    });

    await page.type("input[name='pass']", password, {
      delay: 150,
    });

    await page.click("div._6ltg button[name='login']");
  } catch (err) {}

  await page.waitForTimeout(5000);

  const cookies = await page.cookies();
  await promises.writeFile(
    "./" + cookiesFileName + ".json",
    JSON.stringify(cookies, null, 2)
  );
};

export default loginBot;
