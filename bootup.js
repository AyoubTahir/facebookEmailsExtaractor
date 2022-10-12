import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import facebookBot from "./index.js";

const accounts = [
  {
    manualMode: false,
    testMode: false,
    email: "tahir.ayoub.dev@gmail.com",
    password: "khadija0617760248A",
    cookiesFileName: "cookies",
    linksToExtarct: [
      "https://web.facebook.com/groups/673975246352169/search/?q=email",
    ],
    numberOfPostsToExtract: 20,
  },
];

(async () => {
  puppeteerExtra.use(stealthPlugin());
  facebookBot(accounts[0], puppeteerExtra);
})();
