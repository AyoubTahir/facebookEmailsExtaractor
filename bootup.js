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
        link: "https://web.facebook.com/groups/1911869615745884/search/?q=%40gmail",
        name: "DigitalPlannerAddicts",
        startFrom: 20,
        activatePostition: true,
      },
      /*{
        link: "https://web.facebook.com/groups/532128707368667/search/?q=%40gmail",
        name: "bullet journal",
      },*/
    ],
    numberOfPostsToExtract: 1000,
  },
];

(async () => {
  puppeteerExtra.use(stealthPlugin());
  facebookBot(accounts[0], puppeteerExtra);
})();
