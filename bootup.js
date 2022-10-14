import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import facebookBot from "./index.js";

const accounts = [
  {
    manualMode: false,
    testMode: false,
    email: "",
    password: "",
    cookiesFileName: "cookies",
    linksToExtarct: [
      {
        link: "group search link here",
        name: "group name here",
        startFrom: 1,
        activatePostition: false,
      },
    ],
    numberOfPostsToExtract: 1000,
  },
];

(async () => {
  puppeteerExtra.use(stealthPlugin());
  facebookBot(accounts[0], puppeteerExtra);
})();
